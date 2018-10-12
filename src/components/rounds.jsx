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

    this.themeIcon = { "cross": "icon-cross", "minus": "icon-minus", "plus": "icon-plus" };

    this.showRounds = this.showRounds.bind(this);
    this.goBack = this.goBack.bind(this);
  }

  showRounds() {
    this.c.set('roundsButton', 'hidden', { path: '/' });
    this.c.set('backButton', '', { path: '/' });
    this.c.set('submitState', 'hidden', { path: '/' });
    this.c.set('roundsState', '', { path: '/' });
  }

  goBack() {
    this.c.set('roundsButton', '', { path: '/' });
    this.c.set('backButton', 'hidden', { path: '/' });
    this.c.set('submitState', '', { path: '/' });
    this.c.set('roundsState', 'hidden', { path: '/' });
  }

  render() {
    return (
      <div id="rounds" className={this.c.get('roundsState')}>
         {
            this.c.get('rounds').map((round, index) => (
              <div key={index} className="round">
                <div className={`box ${this.themeIcon[round.teamA.big]}`}></div>
                <div className={`box ${this.themeIcon[round.teamA.small1]}`}></div>
                <div className={`box ${this.themeIcon[round.teamA.small2]}`}></div>
                <div className="box">{round.teamA.points}</div>
                <div className="box">vs</div>
                <div className="box">{round.teamB.points}</div>
                <div className={`box ${this.themeIcon[round.teamB.small1]}`}></div>
                <div className={`box ${this.themeIcon[round.teamB.small2]}`}></div>
                <div className={`box ${this.themeIcon[round.teamB.big]}`}></div>
              </div>
            ))
          }
      </div>
    );
  }
}
export default withCookies(Rounds);