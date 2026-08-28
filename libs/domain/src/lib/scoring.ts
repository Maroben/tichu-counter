import type {
  BetDeclaration,
  BetTuple,
  Game,
  GameSummary,
  Round,
  RoundDraft,
  SeatGameStatistics,
  SeatIndex,
  TeamIndex,
} from './types';

const EMPTY_BETS: BetTuple = [null, null, null, null];

export const teamForSeat = (seat: SeatIndex): TeamIndex => (seat % 2 === 0 ? 0 : 1);

export const createRoundDraft = (startedAt = Date.now()): RoundDraft => ({
  basePointsTeamB: 50,
  doubleTeam: null,
  bets: EMPTY_BETS,
  startedAt,
});

export type RoundDraftAction =
  | { readonly type: 'set-base-points'; readonly teamB: number }
  | { readonly type: 'toggle-double'; readonly team: TeamIndex }
  | { readonly type: 'set-bet'; readonly seat: SeatIndex; readonly bet: BetDeclaration }
  | { readonly type: 'remove-bet'; readonly seat: SeatIndex }
  | { readonly type: 'reset'; readonly startedAt?: number }
  | { readonly type: 'hydrate'; readonly draft: RoundDraft };

const replaceBet = (bets: BetTuple, seat: SeatIndex, bet: BetDeclaration | null): BetTuple => {
  const next = [...bets] as (BetDeclaration | null)[];
  next[seat] = bet;
  return next as unknown as BetTuple;
};

export const validateRound = (draft: RoundDraft): readonly string[] => {
  const errors: string[] = [];
  if (draft.basePointsTeamB < -25 || draft.basePointsTeamB > 125 || draft.basePointsTeamB % 5 !== 0) {
    errors.push('Base points must be between -25 and 125 in steps of five.');
  }

  const declarations = draft.bets.filter((bet): bet is BetDeclaration => bet !== null);
  const successes = draft.bets
    .map((bet, seat) => ({ bet, seat: seat as SeatIndex }))
    .filter(({ bet }) => bet?.successful);
  if (successes.length > 1) errors.push('Only one declaration can succeed in a round.');
  if (declarations.length === 4 && declarations.every((bet) => !bet.successful)) {
    errors.push('At least one of four declarations must succeed.');
  }
  if (draft.doubleTeam !== null && successes.some(({ seat }) => teamForSeat(seat) !== draft.doubleTeam)) {
    errors.push('A successful declaration must belong to the double-winning team.');
  }
  return errors;
};

export const reduceRoundDraft = (draft: RoundDraft, action: RoundDraftAction): RoundDraft => {
  if (action.type === 'hydrate') return action.draft;
  if (action.type === 'reset') return createRoundDraft(action.startedAt);
  if (action.type === 'set-base-points') {
    const candidate = { ...draft, basePointsTeamB: action.teamB, doubleTeam: null };
    return validateRound(candidate).some((error) => error.startsWith('Base points')) ? draft : candidate;
  }
  if (action.type === 'remove-bet') return { ...draft, bets: replaceBet(draft.bets, action.seat, null) };
  if (action.type === 'toggle-double') {
    const candidate = { ...draft, doubleTeam: draft.doubleTeam === action.team ? null : action.team };
    return validateRound(candidate).length === 0 ? candidate : draft;
  }

  const candidate = { ...draft, bets: replaceBet(draft.bets, action.seat, action.bet) };
  return validateRound(candidate).length === 0 ? candidate : draft;
};

const betValue = (bet: BetDeclaration): number => (bet.kind === 'tichu' ? 100 : 200) * (bet.successful ? 1 : -1);

export const scoreRound = (round: RoundDraft): readonly [number, number] => {
  const base: [number, number] =
    round.doubleTeam === 0
      ? [200, 0]
      : round.doubleTeam === 1
        ? [0, 200]
        : [100 - round.basePointsTeamB, round.basePointsTeamB];
  round.bets.forEach((bet, seat) => {
    if (bet) base[teamForSeat(seat as SeatIndex)] += betValue(bet);
  });
  return base;
};

export const scoreGame = (rounds: readonly Round[]): readonly [number, number] =>
  rounds.reduce<[number, number]>(
    (totals, round) => {
      const points = scoreRound(round);
      return [totals[0] + points[0], totals[1] + points[1]];
    },
    [0, 0],
  );

export const isGameComplete = (points: readonly [number, number], targetScore: number): boolean =>
  points[0] !== points[1] && (points[0] >= targetScore || points[1] >= targetScore);

export const winnerFor = (points: readonly [number, number]): TeamIndex => (points[0] > points[1] ? 0 : 1);

export const buildGameSummary = (game: Game, completedAt = Date.now()): GameSummary => {
  const finalPoints = scoreGame(game.rounds);
  if (!isGameComplete(finalPoints, game.targetScore)) throw new Error('The target score has not been reached.');
  const winnerTeam = winnerFor(finalPoints);
  const seatStatistics: SeatGameStatistics[] = game.seats.map((seat) => {
    const bets = game.rounds.flatMap((round) => (round.bets[seat.index] ? [round.bets[seat.index]] : []));
    const tichus = bets.filter((bet) => bet?.kind === 'tichu');
    const grandTichus = bets.filter((bet) => bet?.kind === 'grand-tichu');
    return {
      seatIndex: seat.index,
      userId: seat.linkStatus === 'accepted' ? seat.userId : null,
      gamesWon: seat.team === winnerTeam ? 1 : 0,
      declarations: bets.length,
      successfulDeclarations: bets.filter((bet) => bet?.successful).length,
      tichuDeclarations: tichus.length,
      successfulTichus: tichus.filter((bet) => bet?.successful).length,
      grandTichuDeclarations: grandTichus.length,
      successfulGrandTichus: grandTichus.filter((bet) => bet?.successful).length,
    };
  });
  return {
    finalPoints,
    winnerTeam,
    roundCount: game.rounds.length,
    durationMs: Math.max(0, completedAt - (game.startedAt ?? game.createdAt)),
    seatStatistics,
  };
};
