import React, { Component } from 'react';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

class Rounds extends Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };
  constructor(props) {
    super(props);

    this.c = this.props.cookies;
  }

  render() {
    return (
      <div>
         {
            this.c.get('rounds').map((round, index) => (
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
}
export default withCookies(Rounds);