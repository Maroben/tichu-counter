import React, { Component } from 'react';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

import Settings from './components/settings.jsx';
import Message from './components/message.jsx';
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
      message: {
        state: this.c.get('errorState'),
        message: this.c.get('message')
      },
      rounds: this.c.get('rounds')
    }

    if (!this.c.get('first')) {
      this.c.set('rounds', [], { path: '/' });
      this.c.set('messageState', "hidden", { path: '/' });
      this.c.set('first', true, { path: '/' });
      this.c.set('aName', "Dragon", { path: '/' });
      this.c.set('bName', "Phoenix", { path: '/' });
      this.c.set('goal', 1000, { path: '/' });
      this.c.set('aState', "tie", { path: '/' });
      this.c.set('bState', "tie", { path: '/' });
      this.c.set('submitNewGame', 'hidden', { path: '/' });
    }
  }

  openSettings = () => { this.refs.settings.openSettings(); }
  openMessage = () => { this.refs.message.openMessage(); }
  setScore = () => {this.refs.score.setScore(); }
  newGame = () => {this.refs.settings.newGame(); }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div className="title1">
            <h1>Tichu Counter</h1>
            <button type="button" className="icon-cog" onClick={this.openSettings}></button>
          </div>
          <Score ref="score" />
        </header>

        <main>
          List played rounds.
          <Rounds />
        </main>

        <footer>
          <Submit ref="submit" setScore={this.setScore} />
          <Settings ref="settings" setScore={this.setScore} />
          <Message ref="message" newGame={this.newGame}/>
        </footer>
      </div>
    );
  };
}

export default withCookies(App);
