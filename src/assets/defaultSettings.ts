import Settings from '../models/Settings';
import ITeam from '../models/ITeam';

const teamA: ITeam = {
  name: 'Dragon',
  players: [
    {
      name: 'Azure Dragon',
    },
    {
      name: 'White Tiger',
    },
  ],
};

const teamB: ITeam = {
  name: 'Phoenix',
  players: [
    {
      name: 'Black Tortoise',
    },
    {
      name: 'Vermillion Bird',
    },
  ],
};

const winPoints: number = 1000;

export const defaultSettings: Settings = new Settings(teamA, teamB, winPoints);
