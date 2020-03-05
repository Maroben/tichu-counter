import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { createStyles, Theme } from '@material-ui/core'
import { WithStyles, withStyles } from '@material-ui/core/styles'

import Game from '../models/Game'
import ISettings from '../models/ISettings'

import { defaultSettings } from '../assets/defaultSettings'

import BottomNav from '../components/navigations/bottomNav'
import HeaderNav from '../components/navigations/headerNav'

import CounterView from '../views/counterView'
import StatisticsView from '../views/statisticsView'
import SettingsView from '../views/settingsView'
import SettingsForm from '../components/forms/settingsForm'

const styles = (theme: Theme) => createStyles({})

interface Props extends WithStyles<typeof styles> {}

type State = {
    settings: ISettings
    game: Game
}

class CounterController extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            settings: defaultSettings,
            game: new Game(defaultSettings)
        }
    }

    handleSettings(settings: ISettings) {
        this.setState({ settings })
    }

    render() {
        const { settings, game } = this.state
        return (
            <>
                <div>
                    <HeaderNav />
                    <BottomNav />

                    <Switch>
                        <Route path="/statistics" component={StatisticsView} />
                        <Route
                            path="/settings/edit"
                            render={(props) => (
                                <SettingsForm
                                    {...props}
                                    settings={settings}
                                    onUpdate={() => this.handleSettings}
                                />
                            )}
                        />
                        <Route
                            path="/settings"
                            render={(props) => (
                                <SettingsView {...props} settings={settings} />
                            )}
                        />
                        <Route
                            path="/"
                            exact
                            render={(props) => (
                                <CounterView
                                    {...props}
                                    game={game}
                                    settings={settings}
                                />
                            )}
                        />
                        <Redirect to="/404" />
                    </Switch>
                </div>
            </>
        )
    }
}

export default withStyles(styles)(CounterController)
