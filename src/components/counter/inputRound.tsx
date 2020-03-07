import React, { Component } from 'react'
import { createStyles, Theme } from '@material-ui/core'
import { WithStyles, withStyles } from '@material-ui/core/styles'

import InputBet from './inputBet'
import InputPoints from './inputPoints'

import IBet, { BetType } from '../../models/IBet'
import IRound, { TeamRound } from '../../models/IRound'

import { Grid, Button } from '@material-ui/core'

const styles = (theme: Theme) =>
    createStyles({
        root: {
            margin: theme.spacing(2)
        },
        w100: {
            width: '100%'
        },
        c: {
            textAlign: 'center'
        },
        pr: {
            paddingRight: theme.spacing()
            // fontSize: '2.5em'
        }
    })

interface Props extends WithStyles<typeof styles> {}

type State = {
    round: IRound
    nrBets: number[]
    cantWin: number
    cantDouble: number
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
        nrBets: [0, 0], // [Total Success, Total Failures]
        cantWin: -1, // if 0 TeamA cant win, elseif TeamB cant win
        cantDouble: -1
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

    toggleDouble(team: number) {
        let { round } = this.state
        let enemy = (team + 1) % 2
        let cantWin = -1
        if (round.teamRounds[team].double) {
            round.teamRounds[team].double = false
        } else {
            round.teamRounds[team].double = true
            round.teamRounds[enemy].double = false
            cantWin = enemy
        }
        this.setState({ cantWin })
        this.handleDisplay(round)
    }

    handleSlide(value: number) {
        const { round } = this.state
        round.teamRounds[0].points = 100 - value
        round.teamRounds[1].points = value
        this.setState({ round })
    }

    handleDisplay(round: IRound) {
        let nrBets = [0, 0]
        let cantDouble = -1
        const bets = round.teamRounds[0].bets.concat(round.teamRounds[1].bets)
        bets.map((bet, i) => {
            if (bet.bet != BetType.none) {
                if (bet.success) {
                    nrBets[0]++
                    cantDouble = (Math.floor(i / 2) + 1) % 2
                } else {
                    nrBets[1]++
                }
            }
        })
        this.setState({ round, nrBets, cantDouble })
    }

    render() {
        const { classes } = this.props
        const { round, nrBets, cantWin, cantDouble } = this.state
        const teamA = round.teamRounds[0]
        const teamB = round.teamRounds[1]

        return (
            <div className={classes.root}>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <InputBet
                            bet={teamA.bets[0]}
                            nrBets={nrBets}
                            cantWin={cantWin === 0}
                            onBet={(b) => this.setBet(0, 0, b)}
                            onRemove={() => this.removeBet(0, 0)}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <InputBet
                            bet={teamB.bets[0]}
                            nrBets={nrBets}
                            cantWin={cantWin === 1}
                            onBet={(b) => this.setBet(1, 0, b)}
                            onRemove={() => this.removeBet(1, 0)}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <InputBet
                            bet={teamA.bets[1]}
                            nrBets={nrBets}
                            cantWin={cantWin === 0}
                            onBet={(b) => this.setBet(0, 1, b)}
                            onRemove={() => this.removeBet(0, 1)}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <InputBet
                            bet={teamB.bets[1]}
                            nrBets={nrBets}
                            cantWin={cantWin === 1}
                            onBet={(b) => this.setBet(1, 1, b)}
                            onRemove={() => this.removeBet(1, 1)}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Button
                            variant={teamA.double ? 'contained' : 'outlined'}
                            color={teamA.double ? 'primary' : 'default'}
                            disabled={cantDouble === 0}
                            onClick={() => this.toggleDouble(0)}
                            className={classes.w100}
                        >
                            Double
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button
                            variant={teamB.double ? 'contained' : 'outlined'}
                            color={teamB.double ? 'primary' : 'default'}
                            disabled={cantDouble === 1}
                            onClick={() => this.toggleDouble(1)}
                            className={classes.w100}
                        >
                            Double
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button
                            variant="contained"
                            className={classes.w100}
                            color={teamA.points >= 50 ? 'primary' : 'secondary'}
                        >
                            {teamA.points}
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button
                            variant="contained"
                            className={classes.w100}
                            color={teamB.points >= 50 ? 'primary' : 'secondary'}
                        >
                            {teamB.points}
                        </Button>
                    </Grid>
                    <Grid item xs={12} className={classes.c}>
                        <InputPoints
                            points={teamB.points}
                            onChange={(v) => this.handleSlide(v)}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Button variant="text" className={classes.w100}>
                            Rounds
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button
                            variant="contained"
                            color="primary"
                            className={classes.w100}
                        >
                            save
                        </Button>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default withStyles(styles)(InputRound)
