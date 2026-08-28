import { describe, expect, it } from 'vitest';
import { createGame } from './factories';
import {
  buildGameSummary,
  createRoundDraft,
  isGameComplete,
  reduceRoundDraft,
  scoreGame,
  scoreRound,
  validateRound,
} from './scoring';
import type { Round } from './types';

describe('Tichu scoring', () => {
  it('splits normal round points around 100', () => {
    expect(scoreRound({ ...createRoundDraft(0), basePointsTeamB: -25 })).toEqual([125, -25]);
    expect(scoreRound({ ...createRoundDraft(0), basePointsTeamB: 125 })).toEqual([-25, 125]);
  });

  it('scores doubles and declarations independently', () => {
    const draft = reduceRoundDraft(
      reduceRoundDraft(createRoundDraft(0), {
        type: 'set-bet',
        seat: 0,
        bet: { kind: 'grand-tichu', successful: true },
      }),
      { type: 'toggle-double', team: 0 },
    );
    expect(scoreRound(draft)).toEqual([400, 0]);
  });

  it('rejects contradictory successes and doubles', () => {
    let draft = reduceRoundDraft(createRoundDraft(0), {
      type: 'set-bet',
      seat: 0,
      bet: { kind: 'tichu', successful: true },
    });
    draft = reduceRoundDraft(draft, { type: 'set-bet', seat: 1, bet: { kind: 'tichu', successful: true } });
    expect(draft.bets[1]).toBeNull();
    expect(reduceRoundDraft(draft, { type: 'toggle-double', team: 1 })).toEqual(draft);
  });

  it('prevents four failed declarations', () => {
    const draft = {
      ...createRoundDraft(0),
      bets: [
        { kind: 'tichu', successful: false },
        { kind: 'tichu', successful: false },
        { kind: 'grand-tichu', successful: false },
        { kind: 'grand-tichu', successful: false },
      ] as const,
    };
    expect(validateRound(draft)).toContain('At least one of four declarations must succeed.');
  });

  it('continues tied games above the target', () => {
    expect(isGameComplete([1000, 1000], 1000)).toBe(false);
    expect(isGameComplete([1005, 995], 1000)).toBe(true);
  });

  it('builds a complete game summary', () => {
    const round = { ...createRoundDraft(100), id: 'r1', number: 1, endedAt: 200, createdBy: null } satisfies Round;
    const game = {
      ...createGame({ id: 'game', storage: 'guest', now: 0, targetScore: 100 }),
      status: 'active' as const,
      startedAt: 0,
      rounds: [round],
    };
    expect(scoreGame(game.rounds)).toEqual([50, 50]);
    const winningRound = { ...round, id: 'r2', number: 2, doubleTeam: 0 as const };
    const summary = buildGameSummary({ ...game, rounds: [round, winningRound] }, 1000);
    expect(summary.finalPoints).toEqual([250, 50]);
    expect(summary.winnerTeam).toBe(0);
  });
});
