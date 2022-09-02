import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { createStyles, Theme } from '@material-ui/core';
import { WithStyles, withStyles } from '@material-ui/core/styles';

import Game from '../models/Game';
import Settings from '../models/Settings';

import { defaultSettings } from '../assets/defaultSettings';

import HeaderNav from '../components/navigations/headerNav';

import NotFoundView from '../views/notFoundView';
import CounterView from '../views/counterView';
import UserView from '../views/userView';
import RoundsView from '../views/roundsView';
import StatisticsView from '../views/statisticsView';
import SettingsView from '../views/settingsView';

import { gameStorageProxy } from '../services/gameStorageService';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: '#f5f5f5',
      height: '100vh',
    },
  });

interface Props extends WithStyles<typeof styles> {}

type State = {
  settings: Settings;
  game: Game;
};

class CounterController extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      settings: defaultSettings,
      game: gameStorageProxy(new Game(defaultSettings)),
    };
  }

  handleGame(game: Game) {
    this.setState({ game });
  }

  resetGame() {
    const { game } = this.state;
    game.resetRounds();
    this.setState({ game });
  }

  render() {
    const { settings, game } = this.state;
    const { classes } = this.props;

    return (
      <>
        <div className={classes.root}>
          <HeaderNav />

          <Switch>
            <Route path="/404" component={NotFoundView} />
            <Route path="/u/statistics" component={StatisticsView} />
            <Route path="/u/settings" render={(props) => <SettingsView {...props} settings={settings} />} />
            <Route path="/u" render={(props) => <UserView {...props} resetGame={() => this.resetGame()} />} />
            <Route path="/rounds" render={(props) => <RoundsView {...props} game={game} settings={settings} />} />
            <Route
              path="/"
              exact
              render={(props) => (
                <CounterView {...props} game={game} settings={settings} updateGame={(g) => this.handleGame(g)} />
              )}
            />
            <Redirect to="/404" />
          </Switch>
        </div>
      </>
    );
  }
}

export default withStyles(styles)(CounterController);
