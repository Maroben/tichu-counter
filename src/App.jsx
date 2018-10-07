import React, { Component } from 'react';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

class App extends Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };

  checkCookies = function () {
    let { cookies } = this.props;

    if (cookies.get('rounds') === undefined) {
      cookies.set('round', [], { path: '/' });
      this.resetRound();
    }
  }

  getRound = function () {
    let { cookies } = this.props;

    return {
      teamA: {
        big: cookies.get('a-big'),
        small: cookies.get('a-small'),
        points: cookies.get('a-points')
      },
      teamB: {
        big: cookies.get('b-big'),
        small: cookies.get('b-small'),
        points: cookies.get('b-points')
      }
    }
  }

  calculateScore = function () {

  }

  constructor(props) {
    super(props);

    // Enum Type for the IconState
    this.icon = { "cross": "icon-cross", "minus": "icon-minus", "plus": "icon-plus" };
    Object.freeze(this.icon);

    const { cookies } = props;
    this.checkCookies();

    this.state = {
      settings: {
        goal: cookies.get('max-points'),
        state: cookies.get('settings')
      },
      score: {
        teamA: {
          name: cookies.get('a-name'),
          points: cookies.get('a-score')
        },
        teamB: {
          name: cookies.get('b-name'),
          points: cookies.get('b-score')
        }
      },
      round: {
        teamA: {
          big: cookies.get('a-big'),
          small: cookies.get('a-small'),
          points: cookies.get('a-points')
        },
        teamB: {
          big: cookies.get('b-big'),
          small: cookies.get('b-small'),
          points: cookies.get('b-points')
        }
      },
      rounds: cookies.get('rounds') || []
    };

    this.openSettings = this.openSettings.bind(this);
    this.closeSettings = this.closeSettings.bind(this);
    this.saveSettings = this.saveSettings.bind(this);
    this.newGame = this.newGame.bind(this);
    this.changeSettings = this.changeSettings.bind(this);

    this.changeIconState = this.changeIconState.bind(this);
    this.changePoints = this.changePoints.bind(this);

    this.saveRound = this.saveRound.bind(this);
    this.resetRound = this.resetRound.bind(this);
    this.removeRound = this.removeRound.bind(this);
  }

  changeIconState(id) {
    const { cookies } = this.props;
    const { round } = this.state;
    let iconState = cookies.get(id);

    switch (iconState) {
      case this.icon.cross:
        cookies.set(id, this.icon.minus, { path: '/' });
        break;
      case this.icon.minus:
        cookies.set(id, this.icon.plus, { path: '/' });
        break;
      case this.icon.plus:
        cookies.set(id, this.icon.cross, { path: '/' });
        break;
      default:
        console.log("Wrong target or class");
        break;
    }

    this.setState({ round });
  }

  changePoints(event, id) {
    const { cookies } = this.props;
    const { round } = this.state;
    let points = event.target.value;

    cookies.set(id, points, { path: '/' });

    if (id === "a-points") {
      cookies.set("b-points", 100 - points, { path: '/' });
    } else {
      cookies.set("a-points", 100 - points, { path: '/' });
    }

    this.setState({ round });
  }

  saveRound() {
    let { cookies } = this.props;
    let round = this.getRound();
    let rounds = cookies.get("rounds")

    rounds.push(round);
    cookies.set("rounds", rounds, { path: '/' });

    this.resetRound();
    this.setState({ rounds });
  }

  resetRound() {
    const { cookies } = this.props;
    const { round } = this.state;

    cookies.set('a-big', this.icon.cross, { path: '/' });
    cookies.set('a-small', this.icon.cross, { path: '/' });
    cookies.set('a-points', "", { path: '/' });
    cookies.set('b-points', "", { path: '/' });
    cookies.set('b-small', this.icon.cross, { path: '/' });
    cookies.set('b-big', this.icon.cross, { path: '/' });

    cookies.set('a-name', "Dijan", { path: '/' });
    cookies.set('b-name', "Sandro", { path: '/' });
    cookies.set('a-score', 800, { path: '/' });
    cookies.set('b-score', 200, { path: '/' });
    cookies.set('max-points', 1000, { path: '/' });
    cookies.set('settings', "hidden", { path: '/'});
    this.setState({ round });
  }

  removeRound() {
    let { cookies } = this.props;
    let rounds = cookies.get("rounds")

    rounds = this.state.rounds.slice(0, -1);
    cookies.set("rounds", rounds, { path: '/' });

    this.setState({ rounds });
  }

  openSettings() {
    let { cookies } = this.props;
    let { settings } = this.state;
    cookies.set("settings", "", { path: '/' });
    this.setState({ settings });
  }

  closeSettings() {
    let { cookies } = this.props;
    let { settings } = this.state;
    cookies.set("settings", "hidden", { path: '/' });
    this.setState({ settings });
  }

  saveSettings() {
    this.closeSettings();
  }

  newGame() {
    this.saveSettings();
    let { cookies } = this.props;
    let rounds = cookies.get("rounds")

    cookies.set("rounds", [], { path: '/' });
    this.setState({ rounds });
    this.closeSettings();
  }

  changeSettings(event, id) {
    const { cookies } = this.props;
    const { settings, score } = this.state;
    let points = event.target.value;

    cookies.set(id, points, { path: '/' });

    this.setState({ settings, score });
  }

  render() {
    const { cookies } = this.props;

    return (
      <div className="App">
        <div id="settings" class={cookies.get("settings")}>
          <div className="title">
            <h1>Settings</h1>
            <button type="button" className="icon-cross" onClick={this.closeSettings}></button>
          </div>
          <div className="settings-box">
            <input inputMode="text" value={cookies.get("a-name")} onChange={(event) => this.changeSettings(event, "a-name")} />
            <div className="settings">vs</div>
            <input inputMode="text" value={cookies.get("b-name")} onChange={(event) => this.changeSettings(event, "b-name")} />
          </div>
          <div className="settings-box">
            <div className="settings">predetermined score</div>
            <input inputMode="numeric" value={cookies.get("max-points")} onChange={(event) => this.changeSettings(event, "max-points")} />
          </div>

          <div className="submit">
            <button onClick={this.saveSettings}>Save Settings</button>
            <button onClick={this.newGame}>New Game</button>
          </div>
        </div>

        <header className="App-header">
          <div className="title">
            <h1>Tichu Counter</h1>
            <button type="button" className="icon-cog" onClick={this.openSettings}></button>
          </div>

          <div id="score">
            <div className="team win">
              <div className="team-name">{cookies.get('a-name')}</div>
              <div className="team-points">{cookies.get('a-score')}</div>
            </div>
            <div className="team lose">
              <div className="team-points">{cookies.get('b-score')}</div>
              <div className="team-name">{cookies.get('b-name')}</div>
            </div>
          </div>

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
          {
            cookies.get('rounds').map((round, index) => (
              <div key={index} className="game">
                <div className={`game-box ${round.teamA.big}`}></div>
                <div className={`game-box ${round.teamA.small}`}></div>
                <div className="game-box">{round.teamA.points}</div>
                <div className="game-box">vs</div>
                <div className="game-box">{round.teamB.points}</div>
                <div className={`game-box ${round.teamB.small}`}></div>
                <div className={`game-box ${round.teamB.big}`}></div>
              </div>
            ))
          }
        </main>

        <footer>
          <div className="game">
            <div className="game-box">
              <button type="button" className={cookies.get("a-big")} onClick={() => this.changeIconState("a-big")}></button>
            </div>
            <div className="game-box">
              <button type="button" className={cookies.get("a-small")} onClick={() => this.changeIconState("a-small")}></button>
            </div>
            <div className="game-box">
              <input type="number" inputMode="numeric" value={cookies.get("a-points")} onChange={(event) => this.changePoints(event, "a-points")} />
            </div>

            <div id="vs" className="game-box">vs</div>

            <div className="game-box">
              <input type="number" inputMode="numeric" value={cookies.get("b-points")} onChange={(event) => this.changePoints(event, "b-points")} />
            </div>
            <div className="game-box">
              <button type="button" className={cookies.get("b-small")} onClick={() => this.changeIconState("b-small")}></button>
            </div>
            <div className="game-box">
              <button type="button" className={cookies.get("b-big")} onClick={() => this.changeIconState("b-big")}></button>
            </div>
          </div>

          <div className="submit">
            <button className="icon-checkmark" onClick={this.saveRound}></button>
            <button className="icon-undo" onClick={this.resetRound}></button>
            <button className="icon-bin" onClick={this.removeRound}></button>
          </div>
        </footer>
      </div>
    );
  };
}

export default withCookies(App);
