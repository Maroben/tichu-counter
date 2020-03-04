import React, { useState } from 'react'
import { createStyles, Theme } from '@material-ui/core'
import { WithStyles, withStyles } from '@material-ui/core/styles'

import ISettings from '../../models/ISettings'

import {
    FormGroup,
    FormControl,
    Button,
    InputLabel,
    Input
} from '@material-ui/core'

const styles = (theme: Theme) =>
    createStyles({
        control: {
            marginBottom: theme.spacing(2)
        },
        submit: {
            display: 'flex',
            justifyContent: 'flex-end'
        },
        submitBtn: {
            width: theme.spacing(10),
            marginLeft: theme.spacing(2)
        }
    })

interface Props extends WithStyles<typeof styles> {
    settings: ISettings
    onUpdate: (settings: ISettings) => void
    onCancel: () => void
}

const SettingsForm = ({ classes, settings, onUpdate, onCancel }: Props) => {
    const [teamAName, setTeamAName] = useState(settings.teamA.name)
    const [teamBName, setTeamBName] = useState(settings.teamB.name)
    const [winPoints, setWinPoints] = useState(settings.winPoints)

    const handleSubmit = () => {
        settings.teamA.name = teamAName
        settings.teamB.name = teamBName
        settings.winPoints = winPoints
        onUpdate(settings)
    }

    return (
        <form onSubmit={handleSubmit}>
            <FormGroup>
                <FormControl className={classes.control}>
                    <InputLabel htmlFor="teamAName">Team A</InputLabel>
                    <Input
                        id="teamAName"
                        value={teamAName}
                        onChange={(event) => setTeamAName(event.target.value)}
                    />
                </FormControl>

                <FormControl className={classes.control}>
                    <InputLabel htmlFor="teamBName">Team B</InputLabel>
                    <Input
                        id="teamBName"
                        value={teamBName}
                        onChange={(event) => setTeamBName(event.target.value)}
                    />
                </FormControl>

                <FormControl className={classes.control}>
                    <InputLabel htmlFor="winPoints">Points to Win</InputLabel>
                    <Input
                        id="winPoints"
                        value={winPoints}
                        type="number"
                        onChange={(event) =>
                            setWinPoints(parseInt(event.target.value))
                        }
                    />
                </FormControl>

                <div className={classes.submit}>
                    <Button
                        className={classes.submitBtn}
                        color="secondary"
                        variant="text"
                        onClick={onCancel}
                    >
                        Cancel
                    </Button>
                    <Button
                        className={classes.submitBtn}
                        color="primary"
                        variant="contained"
                        type="submit"
                    >
                        Save
                    </Button>
                </div>
            </FormGroup>
        </form>
    )
}

export default withStyles(styles)(SettingsForm)
