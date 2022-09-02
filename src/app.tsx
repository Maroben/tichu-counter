import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';
import { createStyles, CssBaseline } from '@material-ui/core';

import CounterController from './controllers/counterController';
import LoginView from './views/loginView';
import RegisterView from './views/registerView';

/**
 * Colors
 * Green: #129749
 * Blue: #0db1cc
 * Red: #ee2b37
 * Black: #191b19
 */

const theme = createMuiTheme({
  palette: {
    primary: { main: '#129749' },
    secondary: { main: '#ee2b37' },
  },
});

const styles = () => createStyles({});

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <Switch>
          <Route path="/login" component={LoginView} />
          <Route path="/register" component={RegisterView} />

          <Route path="/" component={CounterController} />
        </Switch>
      </MuiThemeProvider>
    );
  }
}

export default withStyles(styles)(App);
