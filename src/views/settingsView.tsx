import React from "react"
import { createStyles, Theme } from "@material-ui/core"
import { WithStyles, withStyles } from "@material-ui/core/styles"
import Settings from "../models/Settings"
import PlayerField from "../components/forms/playerField"

import { List, Typography } from "@material-ui/core"

const styles = (theme: Theme) =>
    createStyles({
        root: {
            margin: theme.spacing(2)
        },
        title: {
            margin: theme.spacing(2),
            marginTop: theme.spacing(4),
            marginBottom: 0
        }
    })

interface Props extends WithStyles<typeof styles> {
    settings: Settings
}

const SettingsView = ({ classes: c, settings }: Props) => {
    return (
        <div className={c.root}>
            <Typography variant="h4" className={c.title}>
                Settings
            </Typography>
            <Typography variant="h5" className={c.title}>
                Players
            </Typography>
            <List>
                <PlayerField settings={settings} team={0} player={0} />
                <PlayerField settings={settings} team={0} player={1} />
                <PlayerField settings={settings} team={1} player={0} />
                <PlayerField settings={settings} team={1} player={1} />
            </List>
        </div>
    )
}

export default withStyles(styles)(SettingsView)
