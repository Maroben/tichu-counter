

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
        this.themeIcon = { "cross": "icon-cross", "minus": "icon-minus", "plus": "icon-plus" };
        this.themeText = { "cross": "cross", "minus": "minus", "plus": "plus", "unselected": "unselected" };
        Object.freeze(this.icon);

        this.state = {
            points: 50,
            teamA: {
                big: this.themeText.cross,
                small1: this.themeText.cross,
                small2: this.themeText.cross,
                double: this.themeText.unselected,
                pSelection: this.themeText.plus
            },
            teamB: {
                big: this.themeText.cross,
                small1: this.themeText.cross,
                small2: this.themeText.cross,
                double: this.themeText.unselected,
                pSelection: this.themeText.unselected
            },
            theme: this.themeText
        };

        this.changeButtonState = this.changeButtonState.bind(this);
        this.rangeChange = this.rangeChange.bind(this);

        this.saveRound = this.saveRound.bind(this);
        this.resetRound = this.resetRound.bind(this);
        this.removeRound = this.removeRound.bind(this);

    }
    
    changeButtonState(t, id) {
        let { theme } = this.state;
        let team = this.state[t];
        let oponent = this.state[t === "teamA" ? "teamB" : "teamA"];
        let buttonState = team[id];

        switch (buttonState) {
            case theme.unselected:
                team[id] = theme.plus;
                oponent[id] = theme.unselected;
                break;
            case theme.cross:
                team[id] = theme.minus;
                break;
            case theme.minus:
                team[id] = theme.plus;
                break;
            case theme.plus:
                if (id === "double") {
                    team[id] = theme.unselected;
                    break;
                } 
                if (id === "pSelection") {
                    team[id] = theme.unselected;
                    oponent[id] = theme.plus;
                    break;
                } 
                team[id] = theme.cross;
                break;
            default:
                console.log("Wrong target or class");
                break;
        }
        this.setState({ team });
    }

    
    rangeChange(event) {
        let { points } = this.state;
        points = event.target.value;
        this.setState({ points });
    }

    // roundPoints(number) {
    //     if (number % 5 > 2) {
    //         return parseInt(number / 5) * 5 + 5;
    //     }
    //     return parseInt(number / 5) * 5;
    // }

    // checkPoints() {
    //     let { round } = this.state;

    //     round.teamA.points = this.roundPoints(round.teamA.points);
    //     round.teamB.points = this.roundPoints(round.teamB.points);

    //     if ((round.teamA.points == 0) && (round.teamB.points == 0)) {
    //         this.setMessage(`Please insert your points!`);
    //         return false;
    //     }
    //     this.setState({ round });
    //     return true;
    // }

    // checkTichu() {
    //     let { round } = this.state;

    //     let amount = 0;
    //     if (round.teamA.big === "icon-plus") amount++;
    //     if (round.teamA.small === "icon-plus") amount++;
    //     if (round.teamB.big === "icon-plus") amount++;
    //     if (round.teamB.small === "icon-plus") amount++;

    //     if (amount > 1) {
    //         this.setMessage(`It's impossible to have succeeded in more than one Tichu!`);
    //         return false;
    //     }
    //     return true;
    // }

    saveRound() {
        // if (this.checkPoints() && this.checkTichu()) {
        //     let { round } = this.state;
        //     let rounds = this.c.get("rounds");

        //     rounds.push(round);
        //     this.c.set("rounds", rounds, { path: '/' });

        //     this.props.setScore();
        //     this.resetRound();
        // }
    }

    removeRound() {
        // let rounds = this.c.get("rounds");
        // rounds = rounds.slice(0, -1);
        // this.c.set("rounds", rounds, { path: '/' });

        // this.props.setScore();
        // this.resetRound();
    }

    resetRound() {
        let round = {
            points: 50,
            teamA: {
                big: this.themeText.cross,
                small1: this.themeText.cross,
                small2: this.themeText.cross,
                double: this.themeText.unselected,
                pSelection: this.state.teamA.pSelection
            },
            teamB: {
                big: this.themeText.cross,
                small1: this.themeText.cross,
                small2: this.themeText.cross,
                double: this.themeText.unselected,
                pSelection: this.state.teamB.pSelection
            }
        }
        this.setState(round);
    }

    render() {
        let { teamA, teamB, points } = this.state;
        return (
            <div id="submit">
                <div className="round">
                    <div className="container">
                        <div className="box2">
                            <button type="button" className={teamA.big} onClick={() => this.changeButtonState("teamA", "big")}>big Tichu</button>
                            <button type="button" className={teamA.small1} onClick={() => this.changeButtonState("teamA", "small1")}>small Tichu</button>
                            <button type="button" className={teamA.small2} onClick={() => this.changeButtonState("teamA", "small2")}>small Tichu</button>
                            <button type="button" className={teamA.double} onClick={() => this.changeButtonState("teamA", "double")}>double Victory</button>
                        </div>
                        <div className="box2">
                            <button type="button" className={teamB.big} onClick={() => this.changeButtonState("teamB", "big")}>big Tichu</button>
                            <button type="button" className={teamB.small1} onClick={() => this.changeButtonState("teamB", "small1")}>small Tichu</button>
                            <button type="button" className={teamB.small2} onClick={() => this.changeButtonState("teamB", "small2")}>small Tichu</button>
                            <button type="button" className={teamB.double} onClick={() => this.changeButtonState("teamB", "double")}>double Victory</button>
                        </div>
                    </div>
                    <div className="container team">
                        <div className="box3">
                            <button type="button" className={teamA.pSelection} onClick={() => this.changeButtonState("teamA", "pSelection")}>{this.c.get('aName')}</button>
                        </div>
                        <div className="box3 points">
                            {points}
                        </div>
                        <div className="box3">
                            <button type="button" className={teamB.pSelection} onClick={() => this.changeButtonState("teamB", "pSelection")}>{this.c.get('bName')}</button>
                        </div>
                    </div>
                    <div className="container">
                        <div className="box1">
                            <input
                                type="range"
                                value={this.state.points}
                                min="-25"
                                max="125"
                                step="5"
                                onChange={(event) => this.rangeChange(event)}
                            />
                        </div>
                    </div>
                    <div className="container">
                        <div className="box3">
                            <button className="icon-bin" onClick={this.removeRound}></button>
                        </div>
                        <div className="box3">
                            <button className="icon-undo" onClick={this.resetRound}></button>
                        </div>
                        <div className="box3">
                            <button className="icon-checkmark" onClick={this.saveRound}></button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default withCookies(Rounds);