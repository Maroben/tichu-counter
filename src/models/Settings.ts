import ITeam from './ITeam';

export default class Settings {
  private teams: ITeam[];

  constructor(teamA: ITeam, teamB: ITeam, private winPoints: number) {
    this.teams = [teamA, teamB];
  }

  getTeams() {
    return this.teams;
  }

  setTeamName(id: number, name: string) {
    this.teams[id].name = name;
  }

  setPlayer(team: number, player: number, value: string) {
    this.teams[team].players[player].name = value;
  }

  getWinPoints() {
    return this.winPoints;
  }

  setWinPoints(winPoints: number) {
    this.winPoints = winPoints;
  }
}
