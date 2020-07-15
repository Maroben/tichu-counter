import React from 'react'
import { createStyles, Theme } from '@material-ui/core'
import { WithStyles, withStyles } from '@material-ui/core/styles'
import ISettings from '../models/ISettings'
import Game from '../models/Game'
import InputRound from '../components/counter/inputRound'

import { Paper, Grid, Typography } from '@material-ui/core'
import IRound from '../models/IRound'

const styles = (theme: Theme) =>
    createStyles({
        root: {
            // height: `calc(100vh - ${theme.spacing(24)}px)`
            height: `100%`,
            marginBottom: theme.spacing(8)
        },
        container: {
            margin: theme.spacing(2),
            marginTop: theme.spacing(3)
        },
        paper: {
            textAlign: 'center'
        },
        inputRound: {
            display: 'flex',
            alignItems: 'flex-end',
            height: '100%'
        }
    })

interface Props extends WithStyles<typeof styles> {
    settings: ISettings
    game: Game
    updateGame: (game: Game) => void
}

const CounterView = ({ classes, settings, game, updateGame }: Props) => {
    const addRound = (round: IRound) => {
        game.pushRound(round)
        updateGame(game)
    }

    return (
        <div className={classes.root}>
            <div className={classes.container}>
                <Paper className={classes.paper}>
                    <Grid container spacing={2}>
                        <Grid item xs={5}>
                            <Typography variant="h5">Team A</Typography>
                        </Grid>
                        <Grid item xs={2}>
                            <Typography variant="h4"></Typography>
                        </Grid>
                        <Grid item xs={5}>
                            <Typography variant="h5">Team B</Typography>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={5}>
                            <Typography variant="h6">
                                {game.getTotalPoints()[0]}
                            </Typography>
                        </Grid>
                        <Grid item xs={2}>
                            <Typography variant="h6">VS</Typography>
                        </Grid>
                        <Grid item xs={5}>
                            <Typography variant="h6">
                                {game.getTotalPoints()[1]}
                            </Typography>
                        </Grid>
                    </Grid>
                </Paper>
            </div>
            <div className={classes.inputRound}>
                <InputRound addRound={addRound} />
            </div>
        </div>
    )
}

export default withStyles(styles)(CounterView)
