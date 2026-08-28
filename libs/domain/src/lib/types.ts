export const SCHEMA_VERSION = 1 as const;

export type TeamIndex = 0 | 1;
export type SeatIndex = 0 | 1 | 2 | 3;
export type GameStatus = 'lobby' | 'active' | 'finalizing' | 'completed';
export type GameStorage = 'guest' | 'cloud';
export type SeatLinkStatus = 'guest' | 'pending' | 'accepted';
export type SeatLinkSource = 'guest' | 'host' | 'friend' | 'handle' | 'join-code';
export type BetKind = 'tichu' | 'grand-tichu';
export type ColorMode = 'system' | 'light' | 'dark';

export interface BetDeclaration {
  readonly kind: BetKind;
  readonly successful: boolean;
}

export type BetTuple = readonly [
  BetDeclaration | null,
  BetDeclaration | null,
  BetDeclaration | null,
  BetDeclaration | null,
];

export interface RoundDraft {
  readonly basePointsTeamB: number;
  readonly doubleTeam: TeamIndex | null;
  readonly bets: BetTuple;
  readonly startedAt: number;
}

export interface Round extends RoundDraft {
  readonly id: string;
  readonly number: number;
  readonly endedAt: number;
  readonly createdBy: string | null;
}

export interface PlayerSeat {
  readonly index: SeatIndex;
  readonly team: TeamIndex;
  readonly displayName: string;
  readonly userId: string | null;
  readonly linkStatus: SeatLinkStatus;
  readonly linkSource: SeatLinkSource;
}

export type SeatTuple = readonly [PlayerSeat, PlayerSeat, PlayerSeat, PlayerSeat];

export interface SeatGameStatistics {
  readonly seatIndex: SeatIndex;
  readonly userId: string | null;
  readonly gamesWon: 0 | 1;
  readonly declarations: number;
  readonly successfulDeclarations: number;
  readonly tichuDeclarations: number;
  readonly successfulTichus: number;
  readonly grandTichuDeclarations: number;
  readonly successfulGrandTichus: number;
}

export interface GameSummary {
  readonly finalPoints: readonly [number, number];
  readonly winnerTeam: TeamIndex;
  readonly roundCount: number;
  readonly durationMs: number;
  readonly seatStatistics: readonly SeatGameStatistics[];
}

export interface Game {
  readonly schemaVersion: typeof SCHEMA_VERSION;
  readonly id: string;
  readonly storage: GameStorage;
  readonly hostUid: string | null;
  readonly status: GameStatus;
  readonly teamNames: readonly [string, string];
  readonly targetScore: number;
  readonly seats: SeatTuple;
  readonly rounds: readonly Round[];
  readonly draft: RoundDraft;
  readonly nextRoundNumber: number;
  readonly joinCode: string | null;
  readonly createdAt: number;
  readonly updatedAt: number;
  readonly startedAt: number | null;
  readonly completedAt: number | null;
  readonly summary: GameSummary | null;
}

export interface UserProfile {
  readonly schemaVersion: typeof SCHEMA_VERSION;
  readonly uid: string;
  readonly displayName: string;
  readonly handle: string;
  readonly avatarUrl: string | null;
  readonly defaultTargetScore: number;
  readonly colorMode: ColorMode;
  readonly createdAt: number;
  readonly updatedAt: number;
}

export type FriendshipStatus = 'pending' | 'accepted';

export interface Friendship {
  readonly id: string;
  readonly requesterUid: string;
  readonly recipientUid: string;
  readonly userIds: readonly [string, string];
  readonly status: FriendshipStatus;
  readonly createdAt: number;
  readonly updatedAt: number;
}

export interface TeammateStatistics {
  readonly userId: string;
  readonly displayName: string;
  readonly games: number;
  readonly wins: number;
  readonly winRate: number;
}

export interface StatisticsTrendPoint {
  readonly gameId: string;
  readonly completedAt: number;
  readonly won: boolean;
  readonly runningWinRate: number;
}

export interface UserStatistics {
  readonly schemaVersion: typeof SCHEMA_VERSION;
  readonly userId: string;
  readonly gamesPlayed: number;
  readonly gamesWon: number;
  readonly winRate: number;
  readonly declarations: number;
  readonly declarationsPerGame: number;
  readonly declarationSuccessRate: number;
  readonly tichuSuccessRate: number;
  readonly grandTichuSuccessRate: number;
  readonly teammateStatistics: readonly TeammateStatistics[];
  readonly trend: readonly StatisticsTrendPoint[];
  readonly updatedAt: number;
}
