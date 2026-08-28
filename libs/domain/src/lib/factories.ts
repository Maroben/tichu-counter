import { createRoundDraft } from './scoring';
import { SCHEMA_VERSION, type Game, type PlayerSeat, type SeatIndex, type SeatTuple, type TeamIndex } from './types';

const defaultSeat = (index: SeatIndex): PlayerSeat => ({
  index,
  team: (index % 2 === 0 ? 0 : 1) as TeamIndex,
  displayName: `Player ${index + 1}`,
  userId: null,
  linkStatus: 'guest',
  linkSource: 'guest',
});

export interface NewGameOptions {
  readonly id: string;
  readonly storage: 'guest' | 'cloud';
  readonly hostUid?: string | null;
  readonly hostName?: string;
  readonly hostSeat?: SeatIndex;
  readonly targetScore?: number;
  readonly now?: number;
}

export const createGame = ({
  id,
  storage,
  hostUid = null,
  hostName = 'You',
  hostSeat = 0,
  targetScore = 1000,
  now = Date.now(),
}: NewGameOptions): Game => {
  const seats = [defaultSeat(0), defaultSeat(1), defaultSeat(2), defaultSeat(3)] as unknown as PlayerSeat[];
  if (hostUid) {
    seats[hostSeat] = {
      ...seats[hostSeat]!,
      displayName: hostName,
      userId: hostUid,
      linkStatus: 'accepted',
      linkSource: 'host',
    };
  }
  return {
    schemaVersion: SCHEMA_VERSION,
    id,
    storage,
    hostUid,
    status: 'lobby',
    teamNames: ['Dragon', 'Phoenix'],
    targetScore,
    seats: seats as unknown as SeatTuple,
    rounds: [],
    draft: createRoundDraft(now),
    nextRoundNumber: 1,
    joinCode: null,
    createdAt: now,
    updatedAt: now,
    startedAt: null,
    completedAt: null,
    summary: null,
  };
};
