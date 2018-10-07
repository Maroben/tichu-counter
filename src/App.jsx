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

  constructor(props) {
    super(props);

    // Enum Type for the IconState
    this.icon = { "cross": "icon-cross", "minus": "icon-minus", "plus": "icon-plus" };
    Object.freeze(this.icon);

    this.settings = {
        goal: "",
        aName: "",
        bName: ""
    }

    const { cookies } = props;
    this.checkCookies();

    this.state = {
      settings: {
        goal: cookies.get('goal'),
        state: cookies.get('settings-state'),
        teamA: {
          name: cookies.get('aName'),
          score: cookies.get('aScore')
        },
        teamB: {
          name: cookies.get('bName'),
          score: cookies.get('bScore')
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
    this.checkInput = this.checkInput.bind(this);

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
    
    this.settings = {
      goal: cookies.get('goal'),
      aName: cookies.get('aName'),
      bName: cookies.get('bName')
    }

    cookies.set("settings-state", "", { path: '/' });

    this.setState({ settings });
  }

  closeSettings(abort) {
    let { cookies } = this.props;
    let { settings } = this.state;
    
    if (abort) {
      cookies.set("goal", this.settings.goal, { path: '/' });
      cookies.set("aName", this.settings.aName, { path: '/' });
      cookies.set("bName", this.settings.bName, { path: '/' });
    }

    cookies.set("settings-state", "hidden", { path: '/' });
    this.setState({ settings });
  }

  saveSettings() {
    const { settings } = this.state;

    this.checkInput();
    this.closeSettings(false);
    this.setState({ settings });
  }

  newGame() {
    let { cookies } = this.props;

    let rounds = cookies.get("rounds")
    cookies.set("rounds", [], { path: '/' });
    
    this.saveSettings();
    this.setState({ rounds });
  }

  changeSettings(event, id) {
    let { cookies } = this.props;
    let { settings } = this.state;

    cookies.set(id, event.target.value, { path: '/' });

    this.setState({ settings });
  }

  checkInput() {
    let { cookies } = this.props;
    let aName = cookies.get('aName');
    let bName = cookies.get('bName');
    let goal = cookies.get('goal');

    if (aName === "") {
      cookies.set('aName', "Dragon", { path: '/' });
    }
    if (bName === "") {
      cookies.set('bName', "Phoenix", { path: '/' });
    }
    if (goal <= 0 ) {
      cookies.set('goal', 1000, { path: '/' });
    }
  }

  render() {
    const { cookies } = this.props;

    return (
      <div className="App">
        <div id="settings" className={cookies.get("settings-state")}>
          <div className="title">
            <h1>Settings</h1>
            <button type="button" className="icon-cross" onClick={() => this.closeSettings(true)}></button>
          </div>
          <div className="settings-box">
            <input type="text" value={cookies.get("aName")} onChange={(event) => this.changeSettings(event, "aName")} />
            <div className="settings">vs</div>
            <input type="text" value={cookies.get("bName")} onChange={(event) => this.changeSettings(event, "bName")} />
          </div>
          <div className="settings-box">
            <div className="settings">predetermined score</div>
            <input inputMode="numeric" value={cookies.get("goal")} onChange={(event) => this.changeSettings(event, "goal")} />
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
              <div className="team-name">{cookies.get('aName')}</div>
              <div className="team-points">{cookies.get('aScore')}</div>
            </div>
            <div className="team lose">
              <div className="team-points">{cookies.get('bScore')}</div>
              <div className="team-name">{cookies.get('bName')}</div>
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
