

import React, { Component } from 'react';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import './submit.scss';

class Rounds extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    constructor(props) {
        super(props);

        this.c = this.props.cookies;

        // Enum Type for the IconState
        this.icon = { "cross": "icon-cross", "minus": "icon-minus", "plus": "icon-plus" };
        Object.freeze(this.icon);

        this.state = {
            round: {
                teamA: {
                    big: this.icon.cross,
                    small: this.icon.cross,
                    points: ""
                },
                teamB: {
                    big: this.icon.cross,
                    small: this.icon.cross,
                    points: ""
                }
            }
        }

        this.changeIconState = this.changeIconState.bind(this);
        this.changePoints = this.changePoints.bind(this);
        this.roundPoints = this.roundPoints.bind(this);
        this.checkPoints = this.checkPoints.bind(this);

        this.saveRound = this.saveRound.bind(this);
        this.resetRound = this.resetRound.bind(this);
        this.removeRound = this.removeRound.bind(this);
    }

    changeIconState(team, id) {
        let { round } = this.state;
        let t = round[team];
        let iconState = t[id];

        switch (iconState) {
            case this.icon.cross:
                t[id] = this.icon.minus;
                break;
            case this.icon.minus:
                t[id] = this.icon.plus;
                break;
            case this.icon.plus:
                t[id] = this.icon.cross;
                break;
            default:
                console.log("Wrong target or class");
                break;
        }

        this.setState({ round });
    }

    changePoints(event, team) {
        let { round } = this.state;
        let points = event.target.value;
        let other;
        
        if (team === "teamA") { other = "teamB"; } 
        else { other = "teamA"; }

        round[team].points = points;

        if (points == 200 ) {
            round[other].points = 0;
        } 
        else if (points > 125) {
            round[team].points = 125;
            round[other].points = -25;
        }
        else if (points < -25) {
            round[team].points = -25;
            round[other].points = 125;
        }
        else  {
            round[other].points = 100 - points;
        }

        this.setState({ round });
    }

    roundPoints(number) {
        if (number % 5 > 2) {
            return parseInt(number / 5) * 5 + 5;
        }
        return parseInt(number / 5) * 5;
    }

    checkPoints() {
        let { round } = this.state;

        round.teamA.points = this.roundPoints(round.teamA.points);
        round.teamB.points = this.roundPoints(round.teamB.points);

        if ((round.teamA.points == 0) && (round.teamB.points == 0)) {
            this.setMessage(`Please insert your points!`);
            return false;
        }
        this.setState({ round });
        return true;
    }

    checkTichu() {
        let { round } = this.state;

        let amount = 0;
        if (round.teamA.big === "icon-plus") amount++;
        if (round.teamA.small === "icon-plus") amount++;
        if (round.teamB.big === "icon-plus") amount++;
        if (round.teamB.small === "icon-plus") amount++;

        if (amount > 1) {
            this.setMessage(`It's impossible to have succeeded in more than one Tichu!`);
            return false;
        }
        return true;
    }

    saveRound() {
        if (this.checkPoints() && this.checkTichu()) {
            let { round } = this.state;
            let rounds = this.c.get("rounds");

            rounds.push(round);
            this.c.set("rounds", rounds, { path: '/' });

            this.props.setScore();
            this.resetRound();
        }
    }

    removeRound() {
        let rounds = this.c.get("rounds");
        rounds = rounds.slice(0, -1);
        this.c.set("rounds", rounds, { path: '/' });

        this.props.setScore();
        this.resetRound();
    }

    resetRound() {
        let { round } = this.state;

        round = {
            teamA: {
                big: this.icon.cross,
                small: this.icon.cross,
                points: ""
            },
            teamB: {
                big: this.icon.cross,
                small: this.icon.cross,
                points: ""
            }
        }

        this.setState({ round });
    }

    setMessage(message) {
        this.c.set('message', message, { path: '/' });
        this.c.set('messageState', "", { path: '/' });
        this.c.set('submitNewGame', "hidden", { path: '/' });
    }

    render() {
        let { round } = this.state;
        return (
            <footer>
                <div className="round">
                    <div className="box">
                        <button type="button" className={round.teamA.big} onClick={() => this.changeIconState("teamA", "big")}></button>
                    </div>
                    <div className="box">
                        <button type="button" className={round.teamA.small} onClick={() => this.changeIconState("teamA", "small")}></button>
                    </div>
                    <div className="box">
                        <input type="number" onClick={this.select} step="5" inputMode="numeric" value={round.teamA.points} onChange={(event) => this.changePoints(event, "teamA")} />
                    </div>

                    <div className="box vs">vs</div>

                    <div className="box">
                        <input type="number" onClick={this.select} step="5" inputMode="numeric" value={round.teamB.points} onChange={(event) => this.changePoints(event, "teamB")} />
                    </div>
                    <div className="box">
                        <button type="button" className={round.teamB.small} onClick={() => this.changeIconState("teamB", "small")}></button>
                    </div>
                    <div className="box">
                        <button type="button" className={round.teamB.big} onClick={() => this.changeIconState("teamB", "big")}></button>
                    </div>
                </div>

                <div className="submit">
                    <div className="box"><button className="icon-bin" onClick={this.removeRound}></button></div>
                    <div className="box"><button className="icon-undo" onClick={this.resetRound}></button></div>
                    <div className="box"><button className="icon-checkmark" onClick={this.saveRound}></button></div>
                </div>
            </footer>
        );
    }
}
export default withCookies(Rounds);