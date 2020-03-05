import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { createStyles, Theme } from '@material-ui/core'
import { WithStyles, withStyles } from '@material-ui/core/styles'

import { BottomNavigation, BottomNavigationAction } from '@material-ui/core'
import ShowChart from '@material-ui/icons/ShowChart'
import GamesIcon from '@material-ui/icons/Games'
import SettingsIcon from '@material-ui/icons/Settings'

const styles = (theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            position: 'fixed',
            bottom: 0,
            left: 0,
            zIndex: 99
        }
    })

interface Props extends WithStyles<typeof styles> {}

const BottomNav = ({ classes }: Props) => {
    const [value, setValue] = useState(1)
    const path = window.location.pathname
    if (value == 1) {
        if (path === '/statistics') setValue(0)
        if (path === '/settings') setValue(2)
    }

    return (
        <BottomNavigation
            value={value}
            className={classes.root}
            onChange={(event, newValue) => {
                setValue(newValue)
            }}
            showLabels
        >
            <BottomNavigationAction
                to="/statistics"
                component={Link}
                label="Statistics"
                icon={<ShowChart />}
            />

            <BottomNavigationAction
                to="/"
                component={Link}
                label="Counter"
                icon={<GamesIcon />}
            />

            <BottomNavigationAction
                to="/settings"
                component={Link}
                label="Settings"
                icon={<SettingsIcon />}
            />
        </BottomNavigation>
    )
}

export default withStyles(styles)(BottomNav)
