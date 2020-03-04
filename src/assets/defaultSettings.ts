import ISettings from '../models/ISettings'

export const defaultSettings: ISettings = {
    teamA: {
        name: 'Dragon',
        player1: {
            name: 'Player1'
        },
        player2: {
            name: 'Player2'
        }
    },
    teamB: {
        name: 'Phoenix',
        player1: {
            name: 'Player3'
        },
        player2: {
            name: 'Player4'
        }
    },
    winPoints: 1000
}
