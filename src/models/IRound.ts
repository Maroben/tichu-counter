import IBet from './IBet';

export class TeamRound {
  constructor(public bets: IBet[], public points: number, public double: boolean) {}

  getBetPoints(): number {
    let sum = 0;
    this.bets.forEach((b) => {
      sum += b.bet * 100 * (b.success ? 1 : -1);
    });
    return sum;
  }

  getPoints(enemy: TeamRound): number {
    if (this.double) {
      return 200 + this.getBetPoints();
    } else if (enemy.double) {
      return this.getBetPoints();
    }
    return this.points + this.getBetPoints();
  }
}

export default interface IRound {
  teamRounds: TeamRound[];
  startTime: Date;
  endTime: Date;
}
