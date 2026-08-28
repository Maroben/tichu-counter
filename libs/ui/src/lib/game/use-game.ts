import { useCallback, useEffect, useState } from 'react';
import { buildGameSummary, createRoundDraft, type Game, type Round, type RoundDraft } from '@tichu/domain';
import { useAuth, useServices } from '../app-context';

export const useOnline = () => {
  const [online, setOnline] = useState(navigator.onLine);
  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);
  return online;
};

export const useGame = (gameId: string) => {
  const services = useServices();
  const { user } = useAuth();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(Boolean(gameId));
  const [error, setError] = useState<string | null>(null);
  const guest = gameId === 'guest';

  useEffect(() => {
    if (!gameId) {
      setGame(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    if (guest) {
      void services.guestGames
        .load()
        .then(setGame)
        .finally(() => setLoading(false));
      return;
    }
    if (!services.games) {
      setError('Firebase is not configured.');
      setLoading(false);
      return;
    }
    return services.games.subscribe(
      gameId,
      (next) => {
        setGame(next);
        setLoading(false);
      },
      (cause) => {
        setError(cause.message);
        setLoading(false);
      },
    );
  }, [gameId, guest, services.games, services.guestGames]);

  const saveGuest = useCallback(
    async (next: Game) => {
      setGame(next);
      await services.guestGames.save(next);
    },
    [services.guestGames],
  );
  const updateDraft = async (draft: RoundDraft) => {
    if (!game) return;
    if (guest) await saveGuest({ ...game, draft, updatedAt: Date.now() });
    else if (user) await services.games!.updateDraft(game.id, user.uid, draft);
  };
  const updateSettings = async (values: {
    readonly teamNames: readonly [string, string];
    readonly targetScore: number;
    readonly seats: Game['seats'];
  }) => {
    if (!game) return;
    if (guest)
      await saveGuest({
        ...game,
        teamNames: values.teamNames,
        targetScore: values.targetScore,
        seats: values.seats,
        updatedAt: Date.now(),
      });
    else if (user)
      await services.games!.updateSettings(game.id, user.uid, {
        teamNames: values.teamNames,
        targetScore: values.targetScore,
        seats: game.status === 'lobby' ? values.seats : undefined,
      });
  };
  const addRound = async () => {
    if (!game) return;
    if (guest) {
      const now = Date.now();
      const round: Round = {
        ...game.draft,
        id: crypto.randomUUID(),
        number: game.nextRoundNumber,
        endedAt: now,
        createdBy: null,
      };
      await saveGuest({
        ...game,
        rounds: [...game.rounds, round],
        draft: createRoundDraft(now),
        nextRoundNumber: game.nextRoundNumber + 1,
        updatedAt: now,
      });
    } else if (user) await services.games!.addRound(game.id, user.uid);
  };
  const updateRound = async (round: Round) => {
    if (!game) return;
    if (guest)
      await saveGuest({
        ...game,
        rounds: game.rounds.map((item) => (item.id === round.id ? round : item)),
        updatedAt: Date.now(),
      });
    else if (user) await services.games!.updateRound(game.id, user.uid, round);
  };
  const deleteRound = async (roundId: string) => {
    if (!game) return;
    if (guest)
      await saveGuest({ ...game, rounds: game.rounds.filter((round) => round.id !== roundId), updatedAt: Date.now() });
    else if (user) await services.games!.deleteRound(game.id, user.uid, roundId);
  };
  const finalize = async () => {
    if (!game) return;
    if (guest) {
      const now = Date.now();
      await saveGuest({
        ...game,
        status: 'completed',
        completedAt: now,
        summary: buildGameSummary(game, now),
        updatedAt: now,
      });
    } else if (user) await services.games!.finalize(game.id, user.uid);
  };
  const reopen = async () => {
    if (!game) return;
    if (guest) await saveGuest({ ...game, status: 'active', completedAt: null, summary: null, updatedAt: Date.now() });
    else if (user) await services.games!.reopen(game.id, user.uid);
  };
  const remove = async () => {
    if (!game) return;
    if (guest) {
      await services.guestGames.clear();
      setGame(null);
    } else if (user) {
      await services.games!.delete(game.id, user.uid);
      setGame(null);
    }
  };

  return {
    game,
    loading,
    error,
    setError,
    guest,
    updateDraft,
    updateSettings,
    addRound,
    updateRound,
    deleteRound,
    finalize,
    reopen,
    remove,
  };
};
