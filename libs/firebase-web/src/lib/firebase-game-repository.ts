import { createJoinCode, type CreateCloudGameInput, type GameRepository, type Unsubscribe } from '@tichu/application';
import {
  buildGameSummary,
  createGame,
  createRoundDraft,
  validateRound,
  type Game,
  type PlayerSeat,
  type Round,
  type RoundDraft,
  type SeatIndex,
  type SeatTuple,
} from '@tichu/domain';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  Timestamp,
  updateDoc,
  where,
  writeBatch,
  type DocumentData,
  type Firestore,
} from 'firebase/firestore';
import {
  draftFromDocument,
  draftToDocument,
  gameFromDocument,
  gameToDocument,
  roundFromDocument,
  roundToDocument,
} from './mappers';

export class FirestoreGameRepository implements GameRepository {
  constructor(private readonly firestore: Firestore) {}

  private async load(gameId: string): Promise<Game | null> {
    const [gameSnapshot, draftSnapshot, roundsSnapshot] = await Promise.all([
      getDoc(doc(this.firestore, 'games', gameId)),
      getDoc(doc(this.firestore, 'games', gameId, 'draft', 'current')),
      getDocs(query(collection(this.firestore, 'games', gameId, 'rounds'), orderBy('number'))),
    ]);
    if (!gameSnapshot.exists()) return null;
    return gameFromDocument(
      gameId,
      gameSnapshot.data(),
      draftSnapshot.exists() ? draftFromDocument(draftSnapshot.data()) : null,
      roundsSnapshot.docs.map((item) => roundFromDocument(item.id, item.data())),
    );
  }

  async listForUser(uid: string): Promise<readonly Game[]> {
    const snapshot = await getDocs(
      query(collection(this.firestore, 'games'), where('memberUids', 'array-contains', uid)),
    );
    const games = await Promise.all(snapshot.docs.map((item) => this.load(item.id)));
    return games.filter((game): game is Game => game !== null).sort((a, b) => b.updatedAt - a.updatedAt);
  }

  subscribeForUser(uid: string, listener: (games: readonly Game[]) => void): Unsubscribe {
    return onSnapshot(
      query(collection(this.firestore, 'games'), where('memberUids', 'array-contains', uid)),
      async (snapshot) => {
        const games = await Promise.all(snapshot.docs.map((item) => this.load(item.id)));
        listener(games.filter((game): game is Game => game !== null).sort((a, b) => b.updatedAt - a.updatedAt));
      },
    );
  }

  subscribe(gameId: string, listener: (game: Game | null) => void, onError?: (error: Error) => void): Unsubscribe {
    let gameData: DocumentData | null = null;
    let draft: RoundDraft | null = null;
    let rounds: readonly Round[] = [];
    let gameSeen = false;
    const emit = () => {
      if (!gameSeen) return;
      listener(gameData ? gameFromDocument(gameId, gameData, draft, rounds) : null);
    };
    const fail = (error: Error) => onError?.(error);
    const unsubscribers = [
      onSnapshot(
        doc(this.firestore, 'games', gameId),
        (snapshot) => {
          gameSeen = true;
          gameData = snapshot.exists() ? snapshot.data() : null;
          emit();
        },
        fail,
      ),
      onSnapshot(
        doc(this.firestore, 'games', gameId, 'draft', 'current'),
        (snapshot) => {
          draft = snapshot.exists() ? draftFromDocument(snapshot.data()) : null;
          emit();
        },
        fail,
      ),
      onSnapshot(
        query(collection(this.firestore, 'games', gameId, 'rounds'), orderBy('number')),
        (snapshot) => {
          rounds = snapshot.docs.map((item) => roundFromDocument(item.id, item.data()));
          emit();
        },
        fail,
      ),
    ];
    return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
  }

  async create(input: CreateCloudGameInput): Promise<Game> {
    const gameRef = doc(collection(this.firestore, 'games'));
    const code = createJoinCode();
    const now = Date.now();
    const base = createGame({
      id: gameRef.id,
      storage: 'cloud',
      hostUid: input.hostUid,
      hostName: input.hostName,
      hostSeat: input.hostSeat,
      targetScore: input.targetScore,
      now,
    });
    const game: Game = {
      ...base,
      teamNames: input.teamNames,
      seats: input.seats as SeatTuple,
      joinCode: code,
    };
    await runTransaction(this.firestore, async (transaction) => {
      const codeRef = doc(this.firestore, 'joinCodes', code);
      if ((await transaction.get(codeRef)).exists()) throw new Error('Please try creating the game again.');
      transaction.set(gameRef, gameToDocument(game));
      transaction.set(doc(gameRef, 'draft', 'current'), draftToDocument(game.draft));
      transaction.set(codeRef, {
        gameId: game.id,
        hostUid: input.hostUid,
        expiresAt: Timestamp.fromMillis(now + 12 * 60 * 60 * 1000),
      });
    });
    return game;
  }

  async start(gameId: string, hostUid: string): Promise<void> {
    await runTransaction(this.firestore, async (transaction) => {
      const gameRef = doc(this.firestore, 'games', gameId);
      const snapshot = await transaction.get(gameRef);
      if (!snapshot.exists() || snapshot.data().hostUid !== hostUid)
        throw new Error('Only the host can start this game.');
      const seats = snapshot.data().seats as PlayerSeat[];
      if (seats.some((seat) => seat.linkStatus === 'pending'))
        throw new Error('All invitations must be accepted first.');
      const code = snapshot.data().joinCode as string | null;
      transaction.update(gameRef, {
        status: 'active',
        joinCode: null,
        startedAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      if (code) transaction.delete(doc(this.firestore, 'joinCodes', code));
    });
  }

  async updateDraft(gameId: string, _uid: string, draft: RoundDraft): Promise<void> {
    const errors = validateRound(draft);
    if (errors.length) throw new Error(errors[0]);
    await updateDoc(doc(this.firestore, 'games', gameId, 'draft', 'current'), draftToDocument(draft));
  }

  async addRound(gameId: string, uid: string): Promise<void> {
    await runTransaction(this.firestore, async (transaction) => {
      const gameRef = doc(this.firestore, 'games', gameId);
      const draftRef = doc(gameRef, 'draft', 'current');
      const [gameSnapshot, draftSnapshot] = await Promise.all([transaction.get(gameRef), transaction.get(draftRef)]);
      if (!gameSnapshot.exists() || !draftSnapshot.exists()) throw new Error('Game state is unavailable.');
      const gameData = gameSnapshot.data();
      if (gameData.status !== 'active' || !(gameData.acceptedUids as string[]).includes(uid))
        throw new Error('This game is not editable.');
      const currentDraft = draftFromDocument(draftSnapshot.data());
      const errors = validateRound(currentDraft);
      if (errors.length) throw new Error(errors[0]);
      const roundRef = doc(collection(gameRef, 'rounds'));
      const now = Date.now();
      const round: Round = {
        ...currentDraft,
        id: roundRef.id,
        number: gameData.nextRoundNumber as number,
        endedAt: now,
        createdBy: uid,
      };
      transaction.set(roundRef, roundToDocument(round));
      transaction.set(draftRef, draftToDocument(createRoundDraft(now)));
      transaction.update(gameRef, { nextRoundNumber: round.number + 1, updatedAt: Timestamp.fromMillis(now) });
    });
  }

  async updateRound(gameId: string, _uid: string, round: Round): Promise<void> {
    if (validateRound(round).length) throw new Error(validateRound(round)[0]);
    await updateDoc(doc(this.firestore, 'games', gameId, 'rounds', round.id), roundToDocument(round));
    await updateDoc(doc(this.firestore, 'games', gameId), { updatedAt: Timestamp.now() });
  }

  async deleteRound(gameId: string, _uid: string, roundId: string): Promise<void> {
    await deleteDoc(doc(this.firestore, 'games', gameId, 'rounds', roundId));
    await updateDoc(doc(this.firestore, 'games', gameId), { updatedAt: Timestamp.now() });
  }

  async finalize(gameId: string, hostUid: string): Promise<void> {
    const gameRef = doc(this.firestore, 'games', gameId);
    await runTransaction(this.firestore, async (transaction) => {
      const snapshot = await transaction.get(gameRef);
      if (!snapshot.exists() || snapshot.data().hostUid !== hostUid || snapshot.data().status !== 'active')
        throw new Error('Only the host can finish an active game.');
      transaction.update(gameRef, { status: 'finalizing', updatedAt: Timestamp.now() });
    });
    try {
      const frozen = await this.load(gameId);
      if (!frozen) throw new Error('Game not found.');
      const completedAt = Date.now();
      const summary = buildGameSummary(frozen, completedAt);
      await runTransaction(this.firestore, async (transaction) => {
        const snapshot = await transaction.get(gameRef);
        if (!snapshot.exists() || snapshot.data().hostUid !== hostUid || snapshot.data().status !== 'finalizing')
          throw new Error('Game finalization was interrupted.');
        transaction.update(gameRef, {
          status: 'completed',
          completedAt: Timestamp.fromMillis(completedAt),
          summary,
          updatedAt: Timestamp.fromMillis(completedAt),
        });
      });
    } catch (error) {
      await updateDoc(gameRef, { status: 'active', updatedAt: Timestamp.now() });
      throw error;
    }
  }

  async reopen(gameId: string, hostUid: string): Promise<void> {
    await runTransaction(this.firestore, async (transaction) => {
      const reference = doc(this.firestore, 'games', gameId);
      const snapshot = await transaction.get(reference);
      if (!snapshot.exists() || snapshot.data().hostUid !== hostUid || snapshot.data().status !== 'completed')
        throw new Error('Only the host can reopen this game.');
      transaction.update(reference, { status: 'active', completedAt: null, summary: null, updatedAt: Timestamp.now() });
    });
  }

  async delete(gameId: string, hostUid: string): Promise<void> {
    const game = await this.load(gameId);
    if (!game || game.hostUid !== hostUid) throw new Error('Only the host can delete this game.');
    const batch = writeBatch(this.firestore);
    batch.delete(doc(this.firestore, 'games', gameId, 'draft', 'current'));
    const rounds = await getDocs(collection(this.firestore, 'games', gameId, 'rounds'));
    rounds.docs.forEach((round) => batch.delete(round.ref));
    if (game.joinCode) batch.delete(doc(this.firestore, 'joinCodes', game.joinCode));
    batch.delete(doc(this.firestore, 'games', gameId));
    await batch.commit();
  }

  async acceptInvitation(gameId: string, uid: string): Promise<void> {
    await runTransaction(this.firestore, async (transaction) => {
      const reference = doc(this.firestore, 'games', gameId);
      const snapshot = await transaction.get(reference);
      if (!snapshot.exists() || snapshot.data().status !== 'lobby')
        throw new Error('Invitation is no longer available.');
      const seats = (snapshot.data().seats as PlayerSeat[]).map((seat) =>
        seat.userId === uid && seat.linkStatus === 'pending' ? { ...seat, linkStatus: 'accepted' as const } : seat,
      );
      if (!seats.some((seat) => seat.userId === uid && seat.linkStatus === 'accepted'))
        throw new Error('Invitation not found.');
      const acceptedUids = [
        ...new Set(
          seats
            .filter((seat) => seat.linkStatus === 'accepted')
            .map((seat) => seat.userId)
            .filter(Boolean),
        ),
      ];
      transaction.update(reference, { seats, acceptedUids, updatedAt: Timestamp.now() });
    });
  }

  async claimSeat(code: string, uid: string, displayName: string, seat: SeatIndex): Promise<string> {
    const normalized = code.trim().toUpperCase();
    return runTransaction(this.firestore, async (transaction) => {
      const codeRef = doc(this.firestore, 'joinCodes', normalized);
      const codeSnapshot = await transaction.get(codeRef);
      if (!codeSnapshot.exists() || (codeSnapshot.data().expiresAt as Timestamp).toMillis() < Date.now())
        throw new Error('Join code is invalid or expired.');
      const gameId = String(codeSnapshot.data().gameId);
      const gameRef = doc(this.firestore, 'games', gameId);
      const gameSnapshot = await transaction.get(gameRef);
      if (!gameSnapshot.exists() || gameSnapshot.data().status !== 'lobby')
        throw new Error('This game has already started.');
      const seats = [...(gameSnapshot.data().seats as PlayerSeat[])];
      const selected = seats[seat];
      if (!selected || selected.linkStatus !== 'guest' || selected.userId)
        throw new Error('That seat is no longer open.');
      seats[seat] = { ...selected, displayName, userId: uid, linkStatus: 'accepted', linkSource: 'join-code' };
      const memberUids = [...new Set([...(gameSnapshot.data().memberUids as string[]), uid])];
      const acceptedUids = [...new Set([...(gameSnapshot.data().acceptedUids as string[]), uid])];
      transaction.update(gameRef, { seats, memberUids, acceptedUids, updatedAt: Timestamp.now() });
      return gameId;
    });
  }

  async regenerateJoinCode(gameId: string, hostUid: string): Promise<string> {
    const code = createJoinCode();
    await runTransaction(this.firestore, async (transaction) => {
      const gameRef = doc(this.firestore, 'games', gameId);
      const gameSnapshot = await transaction.get(gameRef);
      const codeRef = doc(this.firestore, 'joinCodes', code);
      const codeSnapshot = await transaction.get(codeRef);
      if (!gameSnapshot.exists() || gameSnapshot.data().hostUid !== hostUid || gameSnapshot.data().status !== 'lobby')
        throw new Error('Only the host can change this join code.');
      if (codeSnapshot.exists()) throw new Error('Please try again.');
      const previous = gameSnapshot.data().joinCode as string | null;
      if (previous) transaction.delete(doc(this.firestore, 'joinCodes', previous));
      transaction.set(codeRef, { gameId, hostUid, expiresAt: Timestamp.fromMillis(Date.now() + 12 * 60 * 60 * 1000) });
      transaction.update(gameRef, { joinCode: code, updatedAt: Timestamp.now() });
    });
    return code;
  }
}
