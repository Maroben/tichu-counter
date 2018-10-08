import React, { Component } from 'react';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

import Settings from './components/settings.jsx';
import Error from './components/error.jsx';
import Score from './components/score.jsx';
import Submit from './components/submit.jsx';
import Rounds from './components/rounds.jsx';

class App extends Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };

  constructor(props) {
    super(props);

    this.c = this.props.cookies;

    this.state = {
      settings: {
        first: this.c.get('first') || false,
        goal: this.c.get('goal'),
        state: this.c.get('settingsState'),
        teamA: {
          name: this.c.get('aName'),
          score: this.c.get('aScore'),
          state: this.c.get('aState')
        },
        teamB: {
          name: this.c.get('bName'),
          score: this.c.get('bScore'),
          state: this.c.get('bState')
        }
      },
      error: {
        state: this.c.get('errorState'),
        message: this.c.get('errorMessage')
      },
      rounds: this.c.get('rounds')
    }

    if (!this.c.get('first')) {
      this.c.set('rounds', [], { path: '/' });
      this.c.set('errorState', "hidden", { path: '/' });
      this.c.set('first', true, { path: '/' });
      this.c.set('aName', "Dragon", { path: '/' });
      this.c.set('bName', "Phoenix", { path: '/' });
      this.c.set('goal', 1000, { path: '/' });
      this.c.set('aState', "tie", { path: '/' });
      this.c.set('bState', "tie", { path: '/' });
    }
  }

  openSettings = () => { this.refs.settings.openSettings(); }
  setScore = () => {this.refs.score.setScore(); }

  render() {
    return (
      <div className="App">
        <Settings ref="settings" setScore={this.setScore} />
        <Error ref="error" />

        <header className="App-header">
          <div className="title">
            <h1>Tichu Counter</h1>
            <button type="button" className="icon-cog" onClick={this.openSettings}></button>
          </div>

          <Score ref="score" />

          <div id="game-nav" className="game">
            <div className="game-box">B</div>
            <div className="game-box">S</div>
            <div className="game-box">P</div>
            <div className="game-box">vs</div>
            <div className="game-box">P</div>
            <div className="game-box">S</div>
            <div className="game-box">B</div>
          </div>
        </header>

        <main>
          <Rounds />
        </main>

        <Submit ref="submit" setScore={this.setScore} />
      </div>
    );
  };
}

export default withCookies(App);
