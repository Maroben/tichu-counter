import React, { Component } from 'react';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import Rounds from './components/round.jsx';

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

    const { cookies } = props;
    this.checkCookies();

    this.state = {
      score: {
        teamA: { name: "Dijan", points: 90 },
        teamB: { name: "Sandro", points: 10 }
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

    cookies.set(id, event.target.value, { path: '/' });

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

  render() {
    const { score } = this.state;
    const { cookies } = this.props;

    return (
      <div className="App">
        <header className="App-header">
          <h1>Tichu Counter</h1>
          <div id="score">
            <div className="team win">
              <div className="team-name">{score.teamA.name}</div>
              <div className="team-points">{score.teamA.points}</div>
            </div>
            <div className="team lose">
              <div className="team-points">{score.teamB.points}</div>
              <div className="team-name">{score.teamB.name}</div>
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
          <Rounds rounds={this.state.rounds} />
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
            <button id="submit" type="submit" className="icon-checkmark" onClick={this.saveRound}></button>
            <button id="reset" type="reset" className="icon-undo" onClick={this.resetRound}></button>
            <button id="delete" className="icon-bin" onClick={this.removeRound}></button>
          </div>
        </footer>
      </div>
    );
  };
}

export default withCookies(App);
