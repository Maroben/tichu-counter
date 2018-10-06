import React, { Component } from 'react';
import Rounds from './components/round.jsx';

class App extends Component {
  constructor(props) {
    super(props);
    this.icon = { "cross": "icon-cross", "minus": "icon-minus", "plus": "icon-plus" };
    Object.freeze(this.icon);

    this.state = {
      score: {
        teamA: { name: "Dijan", points: 90 },
        teamB: { name: "Sandro", points: 10 }
      },
      round: {
        teamA: { big: this.icon.cross, small: this.icon.cross, points: "" },
        teamB: { big: this.icon.cross, small: this.icon.cross, points: "" }
      },
      rounds: [
        {
          teamA: { big: this.icon.plus, small: this.icon.cross, points: 30 },
          teamB: { big: this.icon.cross, small: this.icon.minus, points: 70 }
        },
        {
          teamA: { big: this.icon.cross, small: this.icon.cross, points: 15 },
          teamB: { big: this.icon.cross, small: this.icon.cross, points: 85 }
        },
        {
          teamA: { big: this.icon.cross, small: this.icon.plus, points: 60 },
          teamB: { big: this.icon.minus, small: this.icon.cross, points: 40 }
        }
      ]
    };

    this.changeIconState = this.changeIconState.bind(this);
    this.changePoints = this.changePoints.bind(this);

    this.saveRound = this.saveRound.bind(this);
    this.resetRound = this.resetRound.bind(this);
    this.removeRound = this.removeRound.bind(this);
  };

  changeIconState(team, element) {
    let round = this.state.round;
    let iconState = round[team][element];

    switch (iconState) {
      case this.icon.cross:
        round[team][element] = this.icon.minus;
        break;
      case this.icon.minus:
        round[team][element] = this.icon.plus;
        break;
      case this.icon.plus:
        round[team][element] = this.icon.cross;
        break;
      default:
        console.log("Wrong target or class");
        break;
    }
    this.setState({ round: round });
  }

  changePoints(event, team) {
    this.state.round[team].points = event.target.value;
    this.setState({ round: this.state.round });
  }

  saveRound() {
    let rounds = this.state.rounds;
    rounds.push(this.state.round);
    this.resetRound();
    this.setState({ rounds: rounds });
  }

  resetRound() {
    let round = {
      teamA: { big: this.icon.cross, small: this.icon.cross, points: "" },
      teamB: { big: this.icon.cross, small: this.icon.cross, points: "" }
    }
    this.setState({ round: round });
  }

  removeRound() {
    let rounds = this.state.rounds.slice(0, -1);
    this.setState({ rounds: rounds });
  }

  render() {
    let score = this.state.score;
    let round = this.state.round;
    let rounds = this.state.rounds;

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
              <button type="button" className={`box3 ${round.teamA.big}`} onClick={() => this.changeIconState("teamA", "big")}></button>
            </div>
            <div className="game-box">
              <button type="button" className={`box3 ${round.teamA.small}`} onClick={() => this.changeIconState("teamA", "small")}></button>
            </div>
            <div className="game-box">
              <input type="number" inputMode="numeric" value={round.teamA.points} onChange={(event) => this.changePoints(event, "teamA")} />
            </div>

            <div id="vs" className="game-box">vs</div>

            <div className="game-box">
              <input type="number" inputMode="numeric" value={round.teamB.points} onChange={(event) => this.changePoints(event, "teamB")} />
            </div>
            <div className="game-box">
              <button type="button" className={`box3 ${round.teamB.small}`} onClick={() => this.changeIconState("teamB", "small")}></button>
            </div>
            <div className="game-box">
              <button type="button" className={`box3 ${round.teamB.big}`} onClick={() => this.changeIconState("teamB", "big")}></button>
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

export default App;
