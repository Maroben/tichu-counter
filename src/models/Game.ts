import IRound from './IRound'
import ISettings from './ISettings'
import ITeam from './ITeam'

export enum GameState {
    playing,
    over
}

export default class Game {
    dateTime: number
    state: GameState
    rounds: IRound[]

    constructor(private settings: ISettings) {
        this.dateTime = new Date().getUTCDate()
        this.state = GameState.playing

        this.rounds = []
    }

    pushRound(round: IRound) {
        this.rounds.push(round)

        const p = this.getTotalPoints()
        if (this.isOver(p) && p[0] != p[1]) {
            this.state = GameState.over
        }
    }

    popRound() {
        this.rounds.pop()
    }

    deleteRound(index: number) {
        this.rounds.splice(index, 1)
    }

    getTotalPoints(): number[] {
        let teamA = 0
        let teamB = 0
        this.rounds.map((round) => {
            teamA += round.teamRounds[0].getPoints()
            teamB += round.teamRounds[1].getPoints()
        })
        return [teamA, teamB]
    }

    isOver(p: number[]): boolean {
        const { winPoints } = this.settings
        return winPoints <= p[0] || winPoints <= p[1]
    }

    isWinner(): ITeam {
        let p = this.getTotalPoints()
        if (p[0] > p[1]) return this.settings.teamA
        else return this.settings.teamB
    }
}
