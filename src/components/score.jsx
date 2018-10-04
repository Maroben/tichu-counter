import React from 'react';
import './score.css';

function Score(props) {
  return (
    <div className="team">
      <div className="team-name">{props.name}</div>
      <div className="team-points">{props.points}</div>
    </div>
  );
}

export default Score;
