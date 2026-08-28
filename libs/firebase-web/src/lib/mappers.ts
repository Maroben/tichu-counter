import {
  createRoundDraft,
  SCHEMA_VERSION,
  type Game,
  type GameSummary,
  type PlayerSeat,
  type Round,
  type RoundDraft,
  type SeatTuple,
  type UserProfile,
  type UserStatistics,
} from '@tichu/domain';
import { Timestamp, type DocumentData } from 'firebase/firestore';
import { z } from 'zod';

const timestampSchema = z.union([z.number(), z.instanceof(Timestamp)]);
const gameSchema = z.object({
  schemaVersion: z.literal(SCHEMA_VERSION),
  hostUid: z.string(),
  status: z.enum(['lobby', 'active', 'finalizing', 'completed']),
  storage: z.literal('cloud'),
  teamNames: z.tuple([z.string(), z.string()]),
  targetScore: z.number().int().positive(),
  seats: z.array(z.unknown()).length(4),
  nextRoundNumber: z.number().int().positive(),
  joinCode: z.string().nullable(),
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
  startedAt: timestampSchema.nullable(),
  completedAt: timestampSchema.nullable(),
  summary: z.unknown().nullable(),
});

const millis = (value: number | Timestamp | null): number | null =>
  value === null ? null : value instanceof Timestamp ? value.toMillis() : value;
const timestamp = (value: number | null): Timestamp | null => (value === null ? null : Timestamp.fromMillis(value));

export const gameToDocument = (game: Game): DocumentData => ({
  schemaVersion: game.schemaVersion,
  storage: 'cloud',
  hostUid: game.hostUid,
  status: game.status,
  teamNames: game.teamNames,
  targetScore: game.targetScore,
  seats: game.seats,
  memberUids: [...new Set(game.seats.map((seat) => seat.userId).filter(Boolean))],
  acceptedUids: [
    ...new Set(
      game.seats
        .filter((seat) => seat.linkStatus === 'accepted')
        .map((seat) => seat.userId)
        .filter(Boolean),
    ),
  ],
  nextRoundNumber: game.nextRoundNumber,
  joinCode: game.joinCode,
  createdAt: timestamp(game.createdAt),
  updatedAt: timestamp(game.updatedAt),
  startedAt: timestamp(game.startedAt),
  completedAt: timestamp(game.completedAt),
  summary: game.summary,
});

export const gameFromDocument = (
  id: string,
  source: DocumentData,
  draft: RoundDraft | null,
  rounds: readonly Round[],
): Game => {
  const parsed = gameSchema.parse(source);
  return {
    schemaVersion: SCHEMA_VERSION,
    id,
    storage: 'cloud',
    hostUid: parsed.hostUid,
    status: parsed.status,
    teamNames: parsed.teamNames,
    targetScore: parsed.targetScore,
    seats: parsed.seats as unknown as SeatTuple,
    rounds,
    draft: draft ?? createRoundDraft(),
    nextRoundNumber: parsed.nextRoundNumber,
    joinCode: parsed.joinCode,
    createdAt: millis(parsed.createdAt)!,
    updatedAt: millis(parsed.updatedAt)!,
    startedAt: millis(parsed.startedAt),
    completedAt: millis(parsed.completedAt),
    summary: parsed.summary as GameSummary | null,
  };
};

export const draftToDocument = (draft: RoundDraft): DocumentData => ({
  ...draft,
  startedAt: timestamp(draft.startedAt),
});

export const draftFromDocument = (source: DocumentData): RoundDraft => ({
  basePointsTeamB: source.basePointsTeamB as number,
  doubleTeam: (source.doubleTeam ?? null) as 0 | 1 | null,
  bets: source.bets as RoundDraft['bets'],
  startedAt: millis(source.startedAt as Timestamp)!,
});

export const roundToDocument = (round: Round): DocumentData => ({
  ...round,
  startedAt: timestamp(round.startedAt),
  endedAt: timestamp(round.endedAt),
});

export const roundFromDocument = (id: string, source: DocumentData): Round => ({
  id,
  number: source.number as number,
  basePointsTeamB: source.basePointsTeamB as number,
  doubleTeam: (source.doubleTeam ?? null) as 0 | 1 | null,
  bets: source.bets as Round['bets'],
  startedAt: millis(source.startedAt as Timestamp)!,
  endedAt: millis(source.endedAt as Timestamp)!,
  createdBy: (source.createdBy ?? null) as string | null,
});

export const profileFromDocument = (uid: string, source: DocumentData): UserProfile => ({
  schemaVersion: SCHEMA_VERSION,
  uid,
  displayName: String(source.displayName),
  handle: String(source.handle),
  avatarUrl: source.avatarUrl ? String(source.avatarUrl) : null,
  defaultTargetScore: Number(source.defaultTargetScore ?? 1000),
  colorMode: source.colorMode === 'light' || source.colorMode === 'dark' ? source.colorMode : 'system',
  createdAt: millis(source.createdAt as Timestamp | number)!,
  updatedAt: millis(source.updatedAt as Timestamp | number)!,
});

export const profileToDocument = (profile: UserProfile): DocumentData => ({
  ...profile,
  createdAt: timestamp(profile.createdAt),
  updatedAt: timestamp(profile.updatedAt),
});

export const statisticsFromDocument = (source: DocumentData): UserStatistics => ({
  ...(source as UserStatistics),
  updatedAt: millis(source.updatedAt as Timestamp | number)!,
});

export const statisticsToDocument = (statistics: UserStatistics): DocumentData => ({
  ...statistics,
  updatedAt: timestamp(statistics.updatedAt),
});

export type { PlayerSeat };
