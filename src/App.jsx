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
      this.c.set('roundsState', 'hidden', { path: '/' });

      this.c.set('roundsButton', 'hidden', { path: '/' });
      this.c.set('backButton', 'hidden', { path: '/' });

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

  showRounds = () => { this.refs.rounds.showRounds(); }
  goBack = () => { this.refs.rounds.goBack(); }

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
          <button className={`home unselected ${this.c.get('roundsButton')}`} onClick={this.showRounds}>show rounds</button>

          <Rounds ref="rounds" className={this.c.get('roundsButton')} showRounds={this.showRounds}/>
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
            showRounds={this.showRounds}
            openSettings={this.openSettings}
          />
          <div className="box">
            <button type="button" className={`home unselected ${this.c.get('backButton')}`} onClick={this.goBack}>back</button>
          </div>
        </footer>
      </div>
    );
  };
}

export default withCookies(App);
