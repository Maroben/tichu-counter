import React from 'react';

function Round(props) {
  return (
    <div>
      {
        props.rounds.map((round, index) => (
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
    </div>
  );
}

export default Round;
