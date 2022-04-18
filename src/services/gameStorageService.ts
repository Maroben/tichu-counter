import Game from '../models/Game';
import IRound, { TeamRound } from '../models/IRound';
import IBet from '../models/IBet';
import Settings from '../models/Settings';

const STORAGE_KEY = 'tichu-counter-game';
const STATE_CHANGING_GAME_ACTIONS = ['pushRound', 'popRound', 'deleteRound'];

export const gameStorageProxy = (game: Game, storage = localStorage): Game =>
  new Proxy(loadGame(storage) ?? game, {
    get(target, propertyKey, receiver) {
      const property = Reflect.get(target, propertyKey, receiver);

      if (typeof propertyKey === 'string' && STATE_CHANGING_GAME_ACTIONS.includes(propertyKey)) {
        return (...args: unknown[]) => {
          const result = property.apply(target, args);
          saveGame(storage, target);
          return result;
        };
      }

      return property;
    },
  });

type ParsedIRound = Omit<IRound, 'teamRounds'> & {
  teamRounds: {
    bets: IBet[];
    points: number;
    double: boolean;
  }[];
};

const loadGame = (storage: Storage): Game | null => {
  const savedGame = storage.getItem(STORAGE_KEY);

  if (!savedGame) {
    return null;
  }

  try {
    const parsedGame = JSON.parse(savedGame);
    const settings = new Settings(parsedGame.settings.teamA, parsedGame.settings.teamB, parsedGame.settings.winPoints);
    const game = new Game(settings);
    game.gameState = parsedGame.gameState;
    game.rounds = parsedGame.rounds.map(({ teamRounds, startTime, endTime }: ParsedIRound) => ({
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      teamRounds: teamRounds.map(({ bets, points, double }) => new TeamRound(bets, points, double)),
    }));
    game.dateTime = parsedGame.dateTime;
    return game;
  } catch {
    return null;
  }
};

const saveGame = (storage: Storage, game: Game) => storage.setItem(STORAGE_KEY, JSON.stringify(game));
