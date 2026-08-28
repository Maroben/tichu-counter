import type {
  ColorMode,
  Friendship,
  Game,
  PlayerSeat,
  Round,
  RoundDraft,
  SeatIndex,
  UserProfile,
  UserStatistics,
} from '@tichu/domain';

export interface AuthUser {
  readonly uid: string;
  readonly displayName: string;
  readonly avatarUrl: string | null;
}

export type Unsubscribe = () => void;

export interface AuthenticationRepository {
  subscribe(listener: (user: AuthUser | null) => void): Unsubscribe;
  signInWithGoogle(): Promise<void>;
  signOut(): Promise<void>;
}

export interface ProfileRepository {
  get(uid: string): Promise<UserProfile | null>;
  findByHandle(handle: string): Promise<UserProfile | null>;
  create(profile: UserProfile): Promise<void>;
  update(
    uid: string,
    values: { displayName?: string; handle?: string; defaultTargetScore?: number; colorMode?: ColorMode },
  ): Promise<UserProfile>;
}

export interface FriendshipWithProfile extends Friendship {
  readonly otherProfile: UserProfile;
}

export interface FriendshipRepository {
  list(uid: string): Promise<readonly FriendshipWithProfile[]>;
  subscribe(uid: string, listener: (friendships: readonly FriendshipWithProfile[]) => void): Unsubscribe;
  request(requesterUid: string, recipientUid: string): Promise<void>;
  accept(friendshipId: string, recipientUid: string): Promise<void>;
  declineOrRemove(friendshipId: string, uid: string): Promise<void>;
}

export interface CreateCloudGameInput {
  readonly hostUid: string;
  readonly hostName: string;
  readonly hostSeat: SeatIndex;
  readonly targetScore: number;
  readonly teamNames: readonly [string, string];
  readonly seats: readonly PlayerSeat[];
}

export interface GameRepository {
  listForUser(uid: string): Promise<readonly Game[]>;
  subscribeForUser(uid: string, listener: (games: readonly Game[]) => void): Unsubscribe;
  subscribe(gameId: string, listener: (game: Game | null) => void, onError?: (error: Error) => void): Unsubscribe;
  create(input: CreateCloudGameInput): Promise<Game>;
  start(gameId: string, hostUid: string): Promise<void>;
  updateDraft(gameId: string, uid: string, draft: RoundDraft): Promise<void>;
  updateSettings(
    gameId: string,
    hostUid: string,
    values: {
      readonly teamNames: readonly [string, string];
      readonly targetScore: number;
      readonly seats?: readonly PlayerSeat[];
    },
  ): Promise<void>;
  addRound(gameId: string, uid: string): Promise<void>;
  updateRound(gameId: string, uid: string, round: Round): Promise<void>;
  deleteRound(gameId: string, uid: string, roundId: string): Promise<void>;
  finalize(gameId: string, hostUid: string): Promise<void>;
  reopen(gameId: string, hostUid: string): Promise<void>;
  delete(gameId: string, hostUid: string): Promise<void>;
  acceptInvitation(gameId: string, uid: string): Promise<void>;
  claimSeat(code: string, uid: string, displayName: string, seat: SeatIndex): Promise<string>;
  regenerateJoinCode(gameId: string, hostUid: string): Promise<string>;
}

export interface GuestGameRepository {
  load(): Promise<Game | null>;
  save(game: Game): Promise<void>;
  clear(): Promise<void>;
}

export interface LocalSettings {
  readonly defaultTargetScore: number;
  readonly colorMode: ColorMode;
}

export interface LocalSettingsRepository {
  load(): Promise<LocalSettings>;
  save(settings: LocalSettings): Promise<void>;
}

export interface StatisticsRepository {
  getShared(uid: string, viewerUid: string): Promise<UserStatistics | null>;
  publish(stats: UserStatistics): Promise<void>;
}

export interface Services {
  readonly auth: AuthenticationRepository | null;
  readonly profiles: ProfileRepository | null;
  readonly friendships: FriendshipRepository | null;
  readonly games: GameRepository | null;
  readonly guestGames: GuestGameRepository;
  readonly localSettings: LocalSettingsRepository;
  readonly statistics: StatisticsRepository | null;
  readonly firebaseConfigured: boolean;
}
