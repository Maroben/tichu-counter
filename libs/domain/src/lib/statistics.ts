import { SCHEMA_VERSION, type Game, type TeammateStatistics, type UserStatistics } from './types';

const rate = (numerator: number, denominator: number): number => (denominator === 0 ? 0 : numerator / denominator);

export const calculateUserStatistics = (userId: string, source: readonly Game[], now = Date.now()): UserStatistics => {
  const games = source
    .filter(
      (game) =>
        game.status === 'completed' &&
        game.summary &&
        game.seats.some((seat) => seat.userId === userId && seat.linkStatus === 'accepted'),
    )
    .sort((a, b) => (a.completedAt ?? 0) - (b.completedAt ?? 0));

  let gamesWon = 0;
  let declarations = 0;
  let successfulDeclarations = 0;
  let tichus = 0;
  let successfulTichus = 0;
  let grandTichus = 0;
  let successfulGrandTichus = 0;
  const teammateMap = new Map<string, { displayName: string; games: number; wins: number }>();

  const trend = games.map((game, index) => {
    const seat = game.seats.find((candidate) => candidate.userId === userId && candidate.linkStatus === 'accepted')!;
    const seatStats = game.summary!.seatStatistics.find((candidate) => candidate.seatIndex === seat.index)!;
    gamesWon += seatStats.gamesWon;
    declarations += seatStats.declarations;
    successfulDeclarations += seatStats.successfulDeclarations;
    tichus += seatStats.tichuDeclarations;
    successfulTichus += seatStats.successfulTichus;
    grandTichus += seatStats.grandTichuDeclarations;
    successfulGrandTichus += seatStats.successfulGrandTichus;

    game.seats
      .filter((candidate) => candidate.team === seat.team && candidate.index !== seat.index && candidate.userId)
      .forEach((teammate) => {
        const current = teammateMap.get(teammate.userId!) ?? { displayName: teammate.displayName, games: 0, wins: 0 };
        teammateMap.set(teammate.userId!, {
          displayName: teammate.displayName,
          games: current.games + 1,
          wins: current.wins + seatStats.gamesWon,
        });
      });

    return {
      gameId: game.id,
      completedAt: game.completedAt!,
      won: seatStats.gamesWon === 1,
      runningWinRate: rate(gamesWon, index + 1),
    };
  });

  const teammateStatistics: TeammateStatistics[] = [...teammateMap.entries()]
    .map(([teammateId, value]) => ({
      userId: teammateId,
      displayName: value.displayName,
      games: value.games,
      wins: value.wins,
      winRate: rate(value.wins, value.games),
    }))
    .sort((a, b) => b.winRate - a.winRate || b.games - a.games);

  return {
    schemaVersion: SCHEMA_VERSION,
    userId,
    gamesPlayed: games.length,
    gamesWon,
    winRate: rate(gamesWon, games.length),
    declarations,
    declarationsPerGame: rate(declarations, games.length),
    declarationSuccessRate: rate(successfulDeclarations, declarations),
    tichuSuccessRate: rate(successfulTichus, tichus),
    grandTichuSuccessRate: rate(successfulGrandTichus, grandTichus),
    teammateStatistics,
    trend,
    updatedAt: now,
  };
};
