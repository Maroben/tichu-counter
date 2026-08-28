import {
  friendshipId,
  normalizeHandle,
  validateHandle,
  type FriendshipRepository,
  type FriendshipWithProfile,
  type ProfileRepository,
  type StatisticsRepository,
  type Unsubscribe,
} from '@tichu/application';
import { SCHEMA_VERSION, type ColorMode, type Friendship, type UserProfile, type UserStatistics } from '@tichu/domain';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  runTransaction,
  setDoc,
  Timestamp,
  where,
  type Firestore,
} from 'firebase/firestore';
import { profileFromDocument, profileToDocument, statisticsFromDocument, statisticsToDocument } from './mappers';

export class FirestoreProfileRepository implements ProfileRepository {
  constructor(private readonly firestore: Firestore) {}

  async get(uid: string): Promise<UserProfile | null> {
    const snapshot = await getDoc(doc(this.firestore, 'profiles', uid));
    return snapshot.exists() ? profileFromDocument(uid, snapshot.data()) : null;
  }

  async findByHandle(handle: string): Promise<UserProfile | null> {
    const normalized = normalizeHandle(handle);
    const handleSnapshot = await getDoc(doc(this.firestore, 'handles', normalized));
    if (!handleSnapshot.exists()) return null;
    return this.get(String(handleSnapshot.data().uid));
  }

  async create(profile: UserProfile): Promise<void> {
    const error = validateHandle(profile.handle);
    if (error) throw new Error(error);
    const normalized = normalizeHandle(profile.handle);
    await runTransaction(this.firestore, async (transaction) => {
      const handleRef = doc(this.firestore, 'handles', normalized);
      const handleSnapshot = await transaction.get(handleRef);
      if (handleSnapshot.exists()) throw new Error('That handle is already taken.');
      transaction.set(handleRef, { uid: profile.uid, createdAt: Timestamp.fromMillis(profile.createdAt) });
      transaction.set(
        doc(this.firestore, 'profiles', profile.uid),
        profileToDocument({ ...profile, handle: normalized }),
      );
    });
  }

  async update(
    uid: string,
    values: { displayName?: string; handle?: string; defaultTargetScore?: number; colorMode?: ColorMode },
  ): Promise<UserProfile> {
    return runTransaction(this.firestore, async (transaction) => {
      const profileRef = doc(this.firestore, 'profiles', uid);
      const snapshot = await transaction.get(profileRef);
      if (!snapshot.exists()) throw new Error('Profile not found.');
      const current = profileFromDocument(uid, snapshot.data());
      const nextHandle = values.handle ? normalizeHandle(values.handle) : current.handle;
      const error = validateHandle(nextHandle);
      if (error) throw new Error(error);

      if (nextHandle !== current.handle) {
        const nextHandleRef = doc(this.firestore, 'handles', nextHandle);
        const nextHandleSnapshot = await transaction.get(nextHandleRef);
        if (nextHandleSnapshot.exists()) throw new Error('That handle is already taken.');
        transaction.delete(doc(this.firestore, 'handles', current.handle));
        transaction.set(nextHandleRef, { uid, createdAt: Timestamp.now() });
      }
      const next = { ...current, ...values, handle: nextHandle, updatedAt: Date.now() };
      transaction.set(profileRef, profileToDocument(next));
      return next;
    });
  }
}

const friendshipFromDocument = (id: string, source: Record<string, unknown>): Friendship => ({
  id,
  requesterUid: String(source.requesterUid),
  recipientUid: String(source.recipientUid),
  userIds: source.userIds as [string, string],
  status: source.status === 'accepted' ? 'accepted' : 'pending',
  createdAt: (source.createdAt as Timestamp).toMillis(),
  updatedAt: (source.updatedAt as Timestamp).toMillis(),
});

export class FirestoreFriendshipRepository implements FriendshipRepository {
  constructor(
    private readonly firestore: Firestore,
    private readonly profiles: ProfileRepository,
  ) {}

  private async enrich(friendships: readonly Friendship[], uid: string): Promise<readonly FriendshipWithProfile[]> {
    const enriched = await Promise.all(
      friendships.map(async (friendship) => {
        const otherUid = friendship.userIds.find((candidate) => candidate !== uid)!;
        const otherProfile = await this.profiles.get(otherUid);
        return otherProfile ? { ...friendship, otherProfile } : null;
      }),
    );
    return enriched.filter((item): item is FriendshipWithProfile => item !== null);
  }

  async list(uid: string): Promise<readonly FriendshipWithProfile[]> {
    const snapshot = await getDocs(
      query(collection(this.firestore, 'friendships'), where('userIds', 'array-contains', uid)),
    );
    return this.enrich(
      snapshot.docs.map((item) => friendshipFromDocument(item.id, item.data())),
      uid,
    );
  }

  subscribe(uid: string, listener: (friendships: readonly FriendshipWithProfile[]) => void): Unsubscribe {
    return onSnapshot(
      query(collection(this.firestore, 'friendships'), where('userIds', 'array-contains', uid)),
      async (snapshot) => {
        listener(
          await this.enrich(
            snapshot.docs.map((item) => friendshipFromDocument(item.id, item.data())),
            uid,
          ),
        );
      },
    );
  }

  async request(requesterUid: string, recipientUid: string): Promise<void> {
    if (requesterUid === recipientUid) throw new Error('You cannot add yourself.');
    const id = friendshipId(requesterUid, recipientUid);
    if ((await getDoc(doc(this.firestore, 'friendships', id))).exists())
      throw new Error('A friendship or request already exists.');
    const now = Timestamp.now();
    await setDoc(doc(this.firestore, 'friendships', id), {
      schemaVersion: SCHEMA_VERSION,
      requesterUid,
      recipientUid,
      userIds: [requesterUid, recipientUid].sort(),
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    });
  }

  async accept(id: string, recipientUid: string): Promise<void> {
    await runTransaction(this.firestore, async (transaction) => {
      const reference = doc(this.firestore, 'friendships', id);
      const snapshot = await transaction.get(reference);
      if (!snapshot.exists() || snapshot.data().recipientUid !== recipientUid)
        throw new Error('Friend request not found.');
      transaction.update(reference, { status: 'accepted', updatedAt: Timestamp.now() });
    });
  }

  async declineOrRemove(id: string, uid: string): Promise<void> {
    const reference = doc(this.firestore, 'friendships', id);
    const snapshot = await getDoc(reference);
    if (!snapshot.exists() || !(snapshot.data().userIds as string[]).includes(uid))
      throw new Error('Friendship not found.');
    await deleteDoc(reference);
  }
}

export class FirestoreStatisticsRepository implements StatisticsRepository {
  constructor(private readonly firestore: Firestore) {}

  async getShared(uid: string, _viewerUid: string): Promise<UserStatistics | null> {
    void _viewerUid;
    const snapshot = await getDoc(doc(this.firestore, 'sharedStats', uid));
    return snapshot.exists() ? statisticsFromDocument(snapshot.data()) : null;
  }

  async publish(statistics: UserStatistics): Promise<void> {
    await setDoc(doc(this.firestore, 'sharedStats', statistics.userId), statisticsToDocument(statistics));
  }
}
