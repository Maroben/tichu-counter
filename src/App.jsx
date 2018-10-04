import React, { Component } from 'react';
import Score from './components/score.jsx';

class App extends Component {
  state = {
    rounds: [
      {
        teamA: { big: true, small: false, points: 90 },
        teamB: { big: false, small: true, points: 10 },
      },
      {
        teamA: { big: true, small: false, points: 90 },
        teamB: { big: false, small: true, points: 10 },
      },
      {
        teamA: { big: true, small: false, points: 90 },
        teamB: { big: false, small: true, points: 10 },
      }
    ]
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">

          <div id="score">
            <Score name="Team A" points={190} />
            <Score name="Team B" points={110} />
          </div>

          <div id="game-nav" className="game">
            <div className="game-box">\u#x5927</div>
            <div className="game-box">&#x5c0f</div>
            <div className="game-box">&#x8D1F</div>
            <div className="game-box">&#x5206</div>
            <div className="game-box">&#x5BF9</div>
            <div className="game-box">&#x5206</div>
            <div className="game-box">&#x8D1F</div>
            <div className="game-box">&#x5c0f</div>
            <div className="game-box">&#x5927</div>
          </div>
        </header>
        <main>
          <div className="game">
            <div className="game-box icon-cross"></div>
            <div className="game-box icon-plus"></div>
            <div className="game-box icon-plus"></div>
            <div className="game-box">105</div>
            <div className="game-box">&#x5BF9</div>
            <div className="game-box">195</div>
            <div className="game-box icon-minus"></div>
            <div className="game-box icon-plus"></div>
            <div className="game-box icon-cross"></div>
          </div>
        </main>

      </div>
    );
  }
}

export default App;
