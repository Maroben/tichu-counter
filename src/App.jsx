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
        state: this.c.get('messageState'),
        message: this.c.get('message')
      },
      rounds: this.c.get('rounds')
    }

    if (!this.c.get('first')) {
      this.c.set('first', true, { path: '/' });
      this.c.set('rounds', [], { path: '/' });

      this.c.set('message', [], { path: '/' });
      this.c.set('messageState', "hidden", { path: '/' });
      this.c.set('showVictory', 'hidden', { path: '/' });
      this.c.set('showError', 'hidden', { path: '/' });
      this.c.set('submitState', 'hidden', { path: '/' });

      this.c.set('aName', "Dragon", { path: '/' });
      this.c.set('bName', "Phoenix", { path: '/' });
      this.c.set('goal', 1000, { path: '/' });
      this.c.set('aState', "tie", { path: '/' });
      this.c.set('bState', "tie", { path: '/' });
    }
  }

  openSettings = () => { this.refs.settings.openSettings(); }
  newGame = () => { this.refs.settings.newGame(); }

  setVictory = () => { this.refs.message.setVictory(); }
  setError = () => { this.refs.message.setError(); }
  
  setScore = () => { this.refs.score.setScore(); }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div className="title h1">
            <h1>Tichu Counter</h1>
            <button type="button" className="icon-cog" onClick={this.openSettings}></button>
          </div>
          <Score 
            ref="score" 
            setVictory={this.setVictory}
          />
        </header>

        <main>
          List played rounds.
          <Rounds />
        </main>

        <footer>
          <Submit 
            ref="submit" 
            setScore={this.setScore}
            setError={this.setError}
          />

          <Settings ref="settings" setScore={this.setScore} />

          <Message 
            ref="message" 
            newGame={this.newGame}
            openSettings={this.openSettings}
          />
        </footer>
      </div>
    );
  };
}

export default withCookies(App);
