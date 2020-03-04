import React, { useState } from 'react'
import { createStyles, Theme } from '@material-ui/core'
import { WithStyles, withStyles } from '@material-ui/core/styles'
import ISettings from '../models/ISettings'
import SettingsForm from '../components/forms/settingsForm'

import { Typography, Paper, Fab } from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit'

const styles = (theme: Theme) =>
    createStyles({
        root: {
            margin: theme.spacing(2)
        },
        fab: {
            position: 'absolute',
            bottom: theme.spacing(10),
            right: theme.spacing(2)
        },
        paper: {
            padding: theme.spacing(2),
            marginBottom: theme.spacing(2)
        },
        paperTitle: {
            marginBottom: theme.spacing(2)
        },
        contentTitle: {
            marginBottom: theme.spacing(1)
        }
    })

interface Props extends WithStyles<typeof styles> {
    settings: ISettings
    onUpdate: (settings: ISettings) => void
}

const SettingsView = ({ classes, settings, onUpdate }: Props) => {
    const [edit, setEdit] = useState(false)
    const { teamA, teamB } = settings

    const handleUpdate = (settings: ISettings) => {
        setEdit(false)
        onUpdate(settings)
    }

    return (
        <div className={classes.root}>
            {!edit && (
                <>
                    <Fab
                        color="secondary"
                        className={classes.fab}
                        onClick={() => setEdit(true)}
                    >
                        <EditIcon />
                    </Fab>
                    <Paper className={classes.paper}>
                        <Typography variant="h5" className={classes.paperTitle}>
                            Settings
                        </Typography>
                        <Typography
                            variant="body1"
                            className={classes.contentTitle}
                        >
                            {teamA.name}
                        </Typography>
                        <Typography
                            variant="body1"
                            className={classes.contentTitle}
                        >
                            {teamB.name}
                        </Typography>
                        <Typography
                            variant="body1"
                            className={classes.contentTitle}
                        >
                            {settings.winPoints}
                        </Typography>
                    </Paper>
                </>
            )}
            {edit && (
                <Paper className={classes.paper}>
                    <SettingsForm
                        settings={settings}
                        onUpdate={handleUpdate}
                        onCancel={() => setEdit(false)}
                    />
                </Paper>
            )}
        </div>
    )
}

export default withStyles(styles)(SettingsView)
