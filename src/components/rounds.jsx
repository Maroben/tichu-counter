import React, { Component } from 'react';
import './styles/rounds.scss';
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
                <div className={`box ${round.teamA.big}`}></div>
                <div className={`box ${round.teamA.small}`}></div>
                <div className="box">{round.teamA.points}</div>
                <div className="box">vs</div>
                <div className="box">{round.teamB.points}</div>
                <div className={`box ${round.teamB.small}`}></div>
                <div className={`box ${round.teamB.big}`}></div>
              </div>
            ))
          }
      </div>
    );
  }
}
export default withCookies(Rounds);