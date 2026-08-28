import type { PlayerSeat } from './types';

export const duplicateSeatUserIds = (seats: readonly PlayerSeat[]): readonly string[] => {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const seat of seats) {
    if (!seat.userId) continue;
    if (seen.has(seat.userId)) duplicates.add(seat.userId);
    seen.add(seat.userId);
  }
  return [...duplicates].sort();
};

export const hasDuplicateSeatUserIds = (seats: readonly PlayerSeat[]): boolean =>
  duplicateSeatUserIds(seats).length > 0;

export const validateSeatAssignments = (seats: readonly PlayerSeat[]): readonly string[] => {
  const errors: string[] = [];
  if (seats.length !== 4) errors.push('A game must have exactly four seats.');
  if (hasDuplicateSeatUserIds(seats)) errors.push('A player account can only occupy one seat.');
  return errors;
};
