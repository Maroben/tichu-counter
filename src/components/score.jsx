import React, { Component } from 'react';
import './styles/score.scss';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

class Score extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };
    constructor(props) {
        super(props);

        this.c = this.props.cookies;

        this.setScore = this.setScore.bind(this);
    }

    setScore() {
        // TODO redundancy
        let a = this.getScore("teamA", "teamB");
        let b = this.getScore("teamB", "teamA");
        this.c.set('aScore', a, { path: '/' });
        this.c.set('bScore', b, { path: '/' });

        this.setLead(a - b);

        if ((a || b) >= this.c.get('goal')) {
            if (a > b) this.setMessage('aName', 'bName'); 
            else if (b > a) this.setMessage('bName', 'aName'); 
        }
    }

    getScore(team, oponent) {
        let rounds = this.c.get('rounds');
        return rounds.reduce((total, round) => {
            if (round[team].double === "plus") {
                return total + 200 + this.getTichuPoints(round[team]);
            }
            else if (round[oponent].double === "plus") {
                return total + this.getTichuPoints(round[team]);
            }
            return total + parseInt(round[team].points) + this.getTichuPoints(round[team]); 
        }, 0);
    }

    getTichuPoints(team) {
        let tichu = 0;

        // TODO that seems a bit to much ..
        if (team.big === "plus") tichu += 200;
        else if (team.big === "minus") tichu -= 200;
        if (team.small1 === "plus") tichu += 100;
        else if (team.small1 === "minus") tichu -= 100;
        if (team.small2 === "plus") tichu += 100;
        else if (team.small2 === "minus") tichu -= 100;

        return tichu;
    }

    setLead(status) {
        // TODO might be solved better
        if (status > 0) {
            this.c.set('aState', 'win', { path: '/' });
            this.c.set('bState', 'lose', { path: '/' });
        } else if (status < 0) {
            this.c.set('aState', 'lose', { path: '/' });
            this.c.set('bState', 'win', { path: '/' });
        } else {
            this.c.set('aState', 'tie', { path: '/' });
            this.c.set('bState', 'tie', { path: '/' });
        }
    }

    setMessage(winner, loser) {
        let msg = [];
        msg.push(`${this.c.get(winner)} has won!`);
        msg.push(`${this.c.get(loser)} sucks ass.`)
        this.c.set('message', msg, { path: '/' });
        this.props.setVictory();
    }

    render() {
        return (
            <div id="score">
                <div className={`team ${this.c.get('aState')}`}>
                    <div className="name">{this.c.get('aName')}</div>
                    <div className="points">{this.c.get('aScore')}</div>
                </div>
                <div className={`team ${this.c.get('bState')}`}>
                    <div className="points">{this.c.get('bScore')}</div>
                    <div className="name">{this.c.get('bName')}</div>
                </div>
            </div>
        );
    }
}
export default withCookies(Score);