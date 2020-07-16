import React, { Component } from "react"
import { Link } from "react-router-dom"
import { createStyles, Theme } from "@material-ui/core"
import { WithStyles, withStyles } from "@material-ui/core/styles"

import Settings from "../../models/Settings"
import InputBet from "./inputBet"
import InputPoints from "./inputPoints"

import IBet, { BetType } from "../../models/IBet"
import IRound, { TeamRound } from "../../models/IRound"

import { Grid, Button, Typography } from "@material-ui/core"

const styles = (theme: Theme) =>
    createStyles({
        root: {
            margin: theme.spacing(2)
        },
        w100: {
            width: "100%"
        },
        center: {
            textAlign: "center"
        },
        pr: {
            paddingRight: theme.spacing()
        },
        slider: {
            padding: "0 !important",
            textAlign: "center"
        },
        mb2: {
            marginBottom: theme.spacing(2)
        },
        title: {
            textAlign: "center",
            marginBottom: theme.spacing(2),
            marginTop: theme.spacing(3)
        },
        bottom: {
            position: "fixed",
            maxWidth: `calc(800px - ${theme.spacing(2)}px)`,
            width: `calc(100% - ${theme.spacing(2)}px)`,
            bottom: theme.spacing(2),
            right: theme.spacing(2),
            left: theme.spacing(2),
            [theme.breakpoints.up(816)]: {
                left: "unset",
                right: "unset"
            }
        }
    })

interface Props extends WithStyles<typeof styles> {
    addRound: (round: IRound) => void
    settings: Settings
}

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
            ],
            startTime: new Date(),
            endTime: new Date()
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
        round.teamRounds[0].double = false
        round.teamRounds[1].double = false
        this.setState({ round })
    }

    handleDisplay(round: IRound) {
        let nrBets = [0, 0]
        let cantDouble = -1
        const bets = round.teamRounds[0].bets.concat(round.teamRounds[1].bets)
        bets.forEach((bet, i) => {
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

    handleSave() {
        let { round } = this.state
        round.endTime = new Date()
        this.props.addRound(round)
        round = {
            teamRounds: [
                new TeamRound([dBet, dBet], 50, false),
                new TeamRound([dBet, dBet], 50, false)
            ],
            startTime: new Date(),
            endTime: new Date()
        }
        this.handleDisplay(round)
        this.setState({ cantWin: -1 })
    }

    getDisplayPoints(self: TeamRound, other: TeamRound) {
        return self.double ? 200 : other.double ? 0 : self.points
    }

    render() {
        const { classes: c, settings } = this.props
        const { round, nrBets, cantWin, cantDouble } = this.state
        const teams = settings.getTeams()
        const teamA = round.teamRounds[0]
        const teamB = round.teamRounds[1]
        const displayPointsA = this.getDisplayPoints(teamA, teamB)
        const displayPointsB = this.getDisplayPoints(teamB, teamA)

        return (
            <div className={c.root}>
                <Typography variant="h6" className={c.title}>
                    Make a Bet
                </Typography>
                <Grid container spacing={2} className={c.mb2}>
                    <Grid item xs={6}>
                        <InputBet
                            label={teams[0].players[0].name}
                            bet={teamA.bets[0]}
                            nrBets={nrBets}
                            cantWin={cantWin === 0}
                            onBet={(b) => this.setBet(0, 0, b)}
                            onRemove={() => this.removeBet(0, 0)}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <InputBet
                            label={teams[1].players[0].name}
                            bet={teamB.bets[0]}
                            nrBets={nrBets}
                            cantWin={cantWin === 1}
                            onBet={(b) => this.setBet(1, 0, b)}
                            onRemove={() => this.removeBet(1, 0)}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <InputBet
                            label={teams[0].players[1].name}
                            bet={teamA.bets[1]}
                            nrBets={nrBets}
                            cantWin={cantWin === 0}
                            onBet={(b) => this.setBet(0, 1, b)}
                            onRemove={() => this.removeBet(0, 1)}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <InputBet
                            label={teams[1].players[1].name}
                            bet={teamB.bets[1]}
                            nrBets={nrBets}
                            cantWin={cantWin === 1}
                            onBet={(b) => this.setBet(1, 1, b)}
                            onRemove={() => this.removeBet(1, 1)}
                        />
                    </Grid>
                </Grid>
                <Typography variant="h6" className={c.title}>
                    Set Points
                </Typography>
                <Grid container spacing={2} className={c.mb2}>
                    <Grid item xs={6}>
                        <Typography
                            variant="h5"
                            className={`${c.w100} ${c.center}`}
                            color={
                                displayPointsA >= 50 ? "primary" : "secondary"
                            }
                        >
                            {displayPointsA}
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography
                            variant="h5"
                            className={`${c.w100} ${c.center}`}
                            color={
                                displayPointsB >= 50 ? "primary" : "secondary"
                            }
                        >
                            {displayPointsB}
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Button
                            variant={teamA.double ? "contained" : "outlined"}
                            color={teamA.double ? "primary" : "default"}
                            disabled={cantDouble === 0}
                            onClick={() => this.toggleDouble(0)}
                            className={c.w100}
                        >
                            Double
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button
                            variant={teamB.double ? "contained" : "outlined"}
                            color={teamB.double ? "primary" : "default"}
                            disabled={cantDouble === 1}
                            onClick={() => this.toggleDouble(1)}
                            className={c.w100}
                        >
                            Double
                        </Button>
                    </Grid>
                    <Grid item xs={12} className={c.slider}>
                        <InputPoints
                            points={teamB.points}
                            onChange={(v) => this.handleSlide(v)}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={2} className={c.bottom}>
                    <Grid item xs={6}>
                        <Button
                            variant="text"
                            className={c.w100}
                            component={Link}
                            to="/rounds"
                        >
                            Rounds
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button
                            variant="contained"
                            color="primary"
                            className={c.w100}
                            onClick={() => this.handleSave()}
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
