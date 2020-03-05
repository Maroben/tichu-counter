import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { createStyles, Theme } from '@material-ui/core'
import { WithStyles, withStyles } from '@material-ui/core/styles'

import ISettings from '../../models/ISettings'

import {
    FormGroup,
    FormControl,
    Button,
    InputLabel,
    Input,
    Card,
    CardContent,
    CardActions,
    Typography
} from '@material-ui/core'

const styles = (theme: Theme) =>
    createStyles({
        card: {
            margin: theme.spacing(2)
        },
        control: {
            marginBottom: theme.spacing(2),
            width: '100%'
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
    onUpdate: (settings: ISettings) => void
}

const SettingsForm = ({ classes, settings, onUpdate }: Props) => {
    const history = useHistory()
    const [teamAName, setTeamAName] = useState(settings.teamA.name)
    const [teamBName, setTeamBName] = useState(settings.teamB.name)
    const [winPoints, setWinPoints] = useState(settings.winPoints)

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        settings.teamA.name = teamAName
        settings.teamB.name = teamBName
        settings.winPoints = winPoints
        onUpdate(settings)
        history.push('/settings')
    }

    return (
        <Card className={classes.card}>
            <form onSubmit={handleSubmit}>
                <FormGroup>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            Edit Settings
                        </Typography>
                        <FormControl className={classes.control}>
                            <InputLabel htmlFor="teamAName">Team A</InputLabel>
                            <Input
                                id="teamAName"
                                value={teamAName}
                                onChange={(event) =>
                                    setTeamAName(event.target.value)
                                }
                            />
                        </FormControl>

                        <FormControl className={classes.control}>
                            <InputLabel htmlFor="teamBName">Team B</InputLabel>
                            <Input
                                id="teamBName"
                                value={teamBName}
                                onChange={(event) =>
                                    setTeamBName(event.target.value)
                                }
                            />
                        </FormControl>

                        <FormControl className={classes.control}>
                            <InputLabel htmlFor="winPoints">
                                Points to Win
                            </InputLabel>
                            <Input
                                id="winPoints"
                                value={winPoints}
                                type="number"
                                onChange={(event) =>
                                    setWinPoints(parseInt(event.target.value))
                                }
                            />
                        </FormControl>
                    </CardContent>
                    <CardActions className={classes.actions}>
                        <Button
                            color="secondary"
                            variant="text"
                            component={Link}
                            to="/settings"
                        >
                            Cancel
                        </Button>
                        <Button
                            color="primary"
                            variant="contained"
                            type="submit"
                            className={classes.submit}
                        >
                            Save
                        </Button>
                    </CardActions>
                </FormGroup>
            </form>
        </Card>
    )
}

export default withStyles(styles)(SettingsForm)
