import Settings from './Settings';
import IRound from './IRound';
import ITeam from './ITeam';

export enum GameState {
  playing,
  over,
}

export default class Game {
  dateTime: number;
  gameState: GameState;
  rounds: IRound[];

  constructor(private settings: Settings) {
    this.dateTime = new Date().getUTCDate();
    this.gameState = GameState.playing;

    this.rounds = [];
  }

  pushRound(round: IRound) {
    this.rounds.push(round);

    const p = this.getTotalPoints();
    if (this.isOver(p) && p[0] != p[1]) {
      this.gameState = GameState.over;
    }
  }

  popRound() {
    this.rounds.pop();
  }

  deleteRound(index: number) {
    this.rounds.splice(index, 1);
  }

  resetRounds() {
    this.rounds = [];
  }

  getTotalPoints(): number[] {
    let teamA = 0;
    let teamB = 0;
    this.rounds.forEach((round) => {
      teamA += round.teamRounds[0].getPoints(round.teamRounds[1]);
      teamB += round.teamRounds[1].getPoints(round.teamRounds[0]);
    });
    return [teamA, teamB];
  }

  isOver(p: number[]): boolean {
    const winPoints = this.settings.getWinPoints();
    return winPoints <= p[0] || winPoints <= p[1];
  }

  isWinner(): ITeam {
    let p = this.getTotalPoints();
    if (p[0] > p[1]) return this.settings.getTeams()[0];
    else return this.settings.getTeams()[1];
  }
}
