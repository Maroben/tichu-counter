import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { createStyles, Theme } from '@material-ui/core'
import { WithStyles, withStyles } from '@material-ui/core/styles'

import BottomNav from '../components/navigations/bottomNav'
import HeaderNav from '../components/navigations/headerNav'

import CounterView from '../views/counterView'
import StatisticsView from '../views/statisticsView'
import SettingsView from '../views/settingsView'

const styles = (theme: Theme) => createStyles({})

interface Props extends WithStyles<typeof styles> {}

const CounterController = (props: Props) => {
    return (
        <>
            <div>
                <HeaderNav />
                <BottomNav />
                <Switch>
                    <Route path="/statistics" component={StatisticsView} />
                    <Route path="/settings" component={SettingsView} />
                    <Route path="/" exact component={CounterView} />
                    <Redirect to="/404" />
                </Switch>
            </div>
        </>
    )
}

export default withStyles(styles)(CounterController)
