import { describe, expect, it } from 'vitest';
import { createGame } from './factories';
import { buildGameSummary, createRoundDraft } from './scoring';
import { calculateUserStatistics } from './statistics';
import type { Game, PlayerSeat, Round, SeatTuple } from './types';

const completedGame = (): Game => {
  const seats = [
    { index: 0, team: 0, displayName: 'Alice', userId: 'alice', linkStatus: 'accepted', linkSource: 'host' },
    { index: 1, team: 1, displayName: 'Bob', userId: 'bob', linkStatus: 'accepted', linkSource: 'friend' },
    { index: 2, team: 0, displayName: 'Cara', userId: 'cara', linkStatus: 'accepted', linkSource: 'friend' },
    { index: 3, team: 1, displayName: 'Guest', userId: null, linkStatus: 'guest', linkSource: 'guest' },
  ] as PlayerSeat[] as unknown as SeatTuple;
  const round: Round = {
    ...createRoundDraft(0),
    id: 'round',
    number: 1,
    doubleTeam: 0,
    bets: [{ kind: 'tichu', successful: true }, null, null, null],
    endedAt: 100,
    createdBy: 'alice',
  };
  const active = {
    ...createGame({ id: 'game', storage: 'cloud', hostUid: 'alice', now: 0, targetScore: 100 }),
    seats,
    status: 'active' as const,
    startedAt: 0,
    rounds: [round],
  };
  return { ...active, status: 'completed', completedAt: 100, summary: buildGameSummary(active, 100) };
};

describe('user statistics', () => {
  it('counts only the accepted player and groups teammate records', () => {
    const stats = calculateUserStatistics('alice', [completedGame()], 1000);
    expect(stats.gamesPlayed).toBe(1);
    expect(stats.gamesWon).toBe(1);
    expect(stats.declarationSuccessRate).toBe(1);
    expect(stats.teammateStatistics).toEqual([{ userId: 'cara', displayName: 'Cara', games: 1, wins: 1, winRate: 1 }]);
  });

  it('ignores unrelated games', () => {
    expect(calculateUserStatistics('nobody', [completedGame()]).gamesPlayed).toBe(0);
  });
});
