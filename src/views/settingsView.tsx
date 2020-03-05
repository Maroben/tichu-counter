import React from 'react'
import { Link } from 'react-router-dom'
import { createStyles, Theme } from '@material-ui/core'
import { WithStyles, withStyles } from '@material-ui/core/styles'
import ISettings from '../models/ISettings'

import {
    Typography,
    Card,
    CardContent,
    CardActions,
    Button
} from '@material-ui/core'

const styles = (theme: Theme) =>
    createStyles({
        root: {
            margin: theme.spacing(2),
            marginBottom: theme.spacing(10)
        },
        card: {
            marginBottom: theme.spacing(2)
        },
        actions: {
            justifyContent: 'flex-end'
        },
        submit: {
            marginLeft: `${theme.spacing(2)}px !important`
        }
    })

interface Props extends WithStyles<typeof styles> {
    settings: ISettings
}

const SettingsView = ({ classes, settings }: Props) => {
    const { teamA, teamB } = settings

    return (
        <div className={classes.root}>
            <Card className={classes.card}>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        Account
                    </Typography>
                    <Typography gutterBottom variant="body1">
                        With an Account you can save your game data across all
                        of your devices. Additionally, you can add friends to
                        your games, so that they can have insights on the games
                        and to create reliable statistics.
                    </Typography>
                </CardContent>
                <CardActions className={classes.actions}>
                    <Button size="large" color="primary">
                        create
                    </Button>
                    <Button
                        size="large"
                        color="secondary"
                        className={classes.submit}
                    >
                        login
                    </Button>
                </CardActions>
            </Card>

            <Card className={classes.card}>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        Settings
                    </Typography>
                    <Typography variant="body1">{teamA.name}</Typography>
                    <Typography variant="body1">{teamB.name}</Typography>
                    <Typography variant="body1">
                        {settings.winPoints}
                    </Typography>
                </CardContent>
                <CardActions className={classes.actions}>
                    <Button
                        size="large"
                        color="secondary"
                        component={Link}
                        to="/settings/edit"
                        className={classes.submit}
                    >
                        edit
                    </Button>
                </CardActions>
            </Card>
        </div>
    )
}

export default withStyles(styles)(SettingsView)
