import React, { Component } from 'react';
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
        this.getScore = this.getScore.bind(this);
        this.getTichuPoints = this.getTichuPoints.bind(this);
        this.setLead = this.setLead.bind(this);
    }

    setScore() {
        let a = this.getScore("teamA", "aScore");
        let b = this.getScore("teamB", "bScore");
        this.setLead(a - b);
    }

    getScore(team, id) {
        let rounds = this.c.get('rounds');
        let score = rounds.reduce((total, round) => {
            return total + parseInt(round[team].points) + this.getTichuPoints(round[team]); 
        }, 0);
        
        this.c.set(id, score, { path: '/' });
        
        return score;
    }

    getTichuPoints(team) {
        let sum = 0;
        if (team.big === "icon-plus") { sum += 200; }
        if (team.big === "icon-minus") { sum -= 200; }
        if (team.small === "icon-plus") { sum += 100; }
        if (team.small === "icon-minus") { sum -= 100; }
        return sum;
    }

    setLead(status) {
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

    render() {
        return (
            <div id="score">
                <div className={`team ${this.c.get('aState')}`}>
                    <div className="team-name">{this.c.get('aName')}</div>
                    <div className="team-points">{this.c.get('aScore')}</div>
                </div>
                <div className={`team ${this.c.get('bState')}`}>
                    <div className="team-points">{this.c.get('bScore')}</div>
                    <div className="team-name">{this.c.get('bName')}</div>
                </div>
            </div>
        );
    }
}
export default withCookies(Score);