import React from "react"
import { createStyles, Theme } from "@material-ui/core"
import { WithStyles, withStyles } from "@material-ui/core/styles"

import Settings from "../models/Settings"

import TextSettingsField from "../components/forms/textSettingsField"

import { List, Typography } from "@material-ui/core"

import DragonIcon from "../assets/dragon.png"
import PhoenixIcon from "../assets/phoenix.png"

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

const SettingsView = ({ classes: c, settings: s }: Props) => {
    const teams = s.getTeams()

    return (
        <div className={c.root}>
            <Typography variant="h4" className={c.title}>
                Settings
            </Typography>
            <Typography variant="h5" className={c.title}>
                Teams
            </Typography>
            <List>
                <TextSettingsField
                    previous={teams[0].name}
                    onSubmit={(field) => s.setTeamName(0, field)}
                    listIcon={DragonIcon}
                    linkable={true}
                />
                <TextSettingsField
                    previous={teams[1].name}
                    onSubmit={(field) => s.setTeamName(1, field)}
                    listIcon={PhoenixIcon}
                    linkable={true}
                />
            </List>
            <Typography variant="h5" className={c.title}>
                Players
            </Typography>
            <List>
                <TextSettingsField
                    previous={teams[0].players[0].name}
                    onSubmit={(field) => s.setPlayer(0, 0, field)}
                    listIcon={DragonIcon}
                    linkable={true}
                />
                <TextSettingsField
                    previous={teams[0].players[1].name}
                    onSubmit={(field) => s.setPlayer(0, 1, field)}
                    listIcon={DragonIcon}
                    linkable={true}
                />
                <TextSettingsField
                    previous={teams[1].players[0].name}
                    onSubmit={(field) => s.setPlayer(1, 0, field)}
                    listIcon={PhoenixIcon}
                    linkable={true}
                />
                <TextSettingsField
                    previous={teams[1].players[1].name}
                    onSubmit={(field) => s.setPlayer(1, 1, field)}
                    listIcon={PhoenixIcon}
                    linkable={true}
                />
            </List>
        </div>
    )
}

export default withStyles(styles)(SettingsView)
