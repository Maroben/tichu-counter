import { describe, expect, it } from 'vitest';
import { validateSeatAssignments } from './seat-validation';
import type { PlayerSeat } from './types';

const seats = (userIds: readonly (string | null)[]): readonly PlayerSeat[] =>
  userIds.map((userId, index) => ({
    index: index as PlayerSeat['index'],
    team: (index % 2) as PlayerSeat['team'],
    displayName: userId ?? `Guest ${index + 1}`,
    userId,
    linkStatus: userId ? 'accepted' : 'guest',
    linkSource: userId ? 'friend' : 'guest',
  }));

describe('seat assignment validation', () => {
  it('allows guest seats and unique account seats', () => {
    expect(validateSeatAssignments(seats(['host', null, 'alice', 'bob']))).toEqual([]);
  });

  it('rejects games without exactly four seats', () => {
    expect(validateSeatAssignments(seats(['host', 'alice', 'bob']))).toContain('A game must have exactly four seats.');
  });

  it('rejects the same account in multiple seats', () => {
    expect(validateSeatAssignments(seats(['host', 'alice', 'alice', null]))).toContain(
      'A player account can only occupy one seat.',
    );
  });

  it('rejects duplicate pending account seats too', () => {
    const pendingSeats = seats(['host', 'alice', 'alice', null]).map((seat, index) =>
      index === 1 || index === 2 ? { ...seat, linkStatus: 'pending' as const, linkSource: 'handle' as const } : seat,
    );
    expect(validateSeatAssignments(pendingSeats)).toContain('A player account can only occupy one seat.');
  });
});
