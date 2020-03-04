import IBet from './IBet'

export class TeamRound {
    constructor(
        private bets: IBet[],
        private points: number,
        private double: boolean
    ) {}

    getBetPoints(): number {
        let sum = 0
        this.bets.map((b) => {
            sum += b.bet * 100 * (b.success ? -1 : 1)
        })
        return sum
    }

    getPoints(): number {
        if (this.double) {
            return 200 + this.getBetPoints()
        }
        return this.points + this.getBetPoints()
    }
}

export default interface IRound {
    teamA: TeamRound
    teamB: TeamRound
}
