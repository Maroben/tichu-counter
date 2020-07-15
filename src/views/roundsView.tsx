import React from 'react'
import { createStyles, Theme } from '@material-ui/core'
import { WithStyles, withStyles } from '@material-ui/core/styles'

import { getDate } from '../services/dateService'

import Game from '../models/Game'
import ISettings from '../models/ISettings'
import { BetType } from '../models/IBet'

import {
    Grid,
    Typography,
    Paper,
    Card,
    CardActionArea
} from '@material-ui/core'

const styles = (theme: Theme) =>
    createStyles({
        root: {
            margin: theme.spacing(2),
            marginBottom: theme.spacing(10)
        },
        p2: {
            padding: theme.spacing(2)
        },
        mb2: {
            marginBottom: theme.spacing(2)
        },
        c: {
            justifyContent: 'center',
            display: 'flex'
        },
        r: {
            justifyContent: 'flex-end',
            display: 'flex'
        },
        bets: {
            paddingRight: theme.spacing()
        }
    })

interface Props extends WithStyles<typeof styles> {
    game: Game
    settings: ISettings
}

const RoundsView = ({ classes, game, settings }: Props) => {
    return (
        <div className={classes.root}>
            <Paper className={`${classes.p2} ${classes.mb2}`}>
                <Grid container spacing={1}>
                    <Grid item xs={5}>
                        <Typography variant="body1">TEAM</Typography>
                    </Grid>
                    <Grid item xs={2} className={classes.c}>
                        <Typography variant="body1">TOTAL</Typography>
                    </Grid>
                    <Grid item xs={3} className={classes.c}>
                        <Typography variant="body1">BETS</Typography>
                    </Grid>
                    <Grid item xs={2} className={classes.c}>
                        <Typography variant="body1">POINTS</Typography>
                    </Grid>
                </Grid>
            </Paper>
            {game.rounds.map((round, i) => (
                <Card key={`round${i}`} className={classes.mb2}>
                    <CardActionArea className={classes.p2}>
                        <Grid container spacing={1}>
                            <Grid item xs={1}>
                                <Typography variant="body2">
                                    {`#${i + 1}`}
                                </Typography>
                            </Grid>
                            <Grid item xs={11}>
                                <Typography variant="body2">
                                    {getDate(round.endTime)}
                                </Typography>
                            </Grid>

                            {round.teamRounds.map((team, j) => (
                                <React.Fragment key={`${i}${j}`}>
                                    <Grid item xs={5}>
                                        <Typography variant="body1">
                                            {j === 0
                                                ? settings.teamA.name
                                                : settings.teamB.name}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={2} className={classes.c}>
                                        <Typography variant="body1">
                                            {team.getPoints(
                                                round.teamRounds[(j + 1) % 2]
                                            )}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={3} className={classes.c}>
                                        {team.bets.map(
                                            (bet) =>
                                                bet.bet != BetType.none && (
                                                    <Typography
                                                        variant="body1"
                                                        className={classes.bets}
                                                        color={
                                                            bet.success
                                                                ? 'primary'
                                                                : 'secondary'
                                                        }
                                                    >
                                                        {bet.bet ==
                                                        BetType.small
                                                            ? 'S'
                                                            : 'B'}
                                                    </Typography>
                                                )
                                        )}
                                    </Grid>
                                    <Grid item xs={2} className={classes.c}>
                                        <Typography variant="body1">
                                            {team.double
                                                ? '200'
                                                : round.teamRounds[(j + 1) % 2]
                                                      .double
                                                ? '0'
                                                : team.points}
                                        </Typography>
                                    </Grid>
                                </React.Fragment>
                            ))}
                        </Grid>
                    </CardActionArea>
                </Card>
            ))}
        </div>
    )
}

export default withStyles(styles)(RoundsView)
