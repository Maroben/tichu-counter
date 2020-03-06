import React, { Component } from 'react'
import { createStyles, Theme } from '@material-ui/core'
import { WithStyles, withStyles } from '@material-ui/core/styles'

import InputBet from './inputBet'

import IBet, { BetType } from '../../models/IBet'
import IRound, { TeamRound } from '../../models/IRound'

import { Grid } from '@material-ui/core'

const styles = (theme: Theme) =>
    createStyles({
        root: {
            margin: theme.spacing(2)
        },
        button: {
            width: '100%'
        }
    })

interface Props extends WithStyles<typeof styles> {}

type State = {
    round: IRound
    nrBets: number[]
}

const dBet = { bet: BetType.none, success: true }

class InputRound extends Component<Props, State> {
    state = {
        round: {
            teamRounds: [
                new TeamRound([dBet, dBet], 50, false),
                new TeamRound([dBet, dBet], 50, false)
            ]
        },
        nrBets: [0, 0] // [Total Success, Total Failures]
    }

    setBet(team: number, bNr: number, b: IBet) {
        let { round } = this.state
        round.teamRounds[team].bets[bNr] = b
        this.handleDisplay(round)
    }

    removeBet(team: number, bNr: number) {
        let { round } = this.state
        round.teamRounds[team].bets[bNr] = dBet
        this.handleDisplay(round)
    }

    handleDisplay(round: IRound) {
        let nrBets = [0, 0]
        const bets = round.teamRounds[0].bets.concat(round.teamRounds[1].bets)
        bets.map((bet) => {
            if (bet.bet != BetType.none) {
                bet.success ? nrBets[0]++ : nrBets[1]++
            }
        })
        this.setState({ round, nrBets })
    }

    render() {
        const { classes } = this.props
        const { round, nrBets } = this.state
        const teamA = round.teamRounds[0]
        const teamB = round.teamRounds[1]

        return (
            <div className={classes.root}>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <InputBet
                            bet={teamA.bets[0]}
                            nrBets={nrBets}
                            onBet={(b) => this.setBet(0, 0, b)}
                            onRemove={() => this.removeBet(0, 0)}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <InputBet
                            bet={teamB.bets[0]}
                            nrBets={nrBets}
                            onBet={(b) => this.setBet(1, 0, b)}
                            onRemove={() => this.removeBet(1, 0)}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <InputBet
                            bet={teamA.bets[1]}
                            nrBets={nrBets}
                            onBet={(b) => this.setBet(0, 1, b)}
                            onRemove={() => this.removeBet(0, 1)}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <InputBet
                            bet={teamB.bets[1]}
                            nrBets={nrBets}
                            onBet={(b) => this.setBet(1, 1, b)}
                            onRemove={() => this.removeBet(1, 1)}
                        />
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default withStyles(styles)(InputRound)
