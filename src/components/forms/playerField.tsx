import React, { useState } from "react"
import { createStyles, Theme } from "@material-ui/core"
import { WithStyles, withStyles } from "@material-ui/core/styles"
import Settings from "../../models/Settings"

import {
    TextField,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton
} from "@material-ui/core"

import LinkIcon from "@material-ui/icons/LinkSharp"
import EditIcon from "@material-ui/icons/EditSharp"
import ClearIcon from "@material-ui/icons/ClearSharp"
import CheckIcon from "@material-ui/icons/CheckSharp"

const styles = (theme: Theme) =>
    createStyles({
        listItem: {
            height: theme.spacing(8)
        }
    })

interface Props extends WithStyles<typeof styles> {
    settings: Settings
    team: number
    player: number
}

const PlayerField = ({ classes: c, settings, team: t, player: p }: Props) => {
    const teams = settings.getTeams()

    const label = `Team ${teams[0].name} Player ${t * 2 + p + 1}`
    const previous = teams[t].players[p].name

    const [field, setField] = useState(previous)
    const [edit, setEdit] = useState(false)

    const onClear = () => {
        setField(previous)
        setEdit(false)
    }

    const onSubmit = () => {
        settings.setPlayer(t, p, field)
        setEdit(false)
    }

    return (
        <ListItem className={c.listItem}>
            {edit ? (
                <>
                    <TextField
                        id={label}
                        label={label}
                        value={field}
                        onChange={({ target }) => setField(target.value)}
                    />
                    <ListItemSecondaryAction>
                        <IconButton color="secondary" onClick={onClear}>
                            <ClearIcon />
                        </IconButton>
                        <IconButton
                            edge="end"
                            color="primary"
                            onClick={onSubmit}
                        >
                            <CheckIcon />
                        </IconButton>
                    </ListItemSecondaryAction>
                </>
            ) : (
                <>
                    <ListItemText primary={field} secondary={label} />
                    <ListItemSecondaryAction>
                        <IconButton disabled>
                            <LinkIcon />
                        </IconButton>
                        <IconButton edge="end" onClick={() => setEdit(true)}>
                            <EditIcon />
                        </IconButton>
                    </ListItemSecondaryAction>
                </>
            )}
        </ListItem>
    )
}

export default withStyles(styles)(PlayerField)
