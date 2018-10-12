import React, { Component } from 'react';
import './styles/message.scss';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

class Error extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    constructor(props) {
        super(props);

        this.c = this.props.cookies;

        this.setVictory = this.setVictory.bind(this);
        this.setError = this.setError.bind(this);

        this.closeMessage = this.closeMessage.bind(this);

        this.openSettings = this.openSettings.bind(this);
        this.showRounds = this.showRounds.bind(this);
        this.newGame = this.newGame.bind(this);

        
    }

    setVictory() {
        this.openMessage();
        this.c.set("showVictory", "", { path: '/' });
    }

    setError() {
        this.openMessage();
        this.c.set("showError", "", { path: '/' });
    }

    openMessage() {
        this.c.set("messageState", '', { path: '/' });
        this.c.set("submitState", "hidden", { path: '/' });
    }

    closeMessage (special) {
        this.c.set('messageState', "hidden", { path: '/' });
        this.c.set('showVictory', 'hidden', { path: '/' });
        this.c.set('showError', 'hidden', { path: '/' });
        if (!special) this.c.set("submitState", "", { path: '/' });
    }

    openSettings () {
        this.props.openSettings();
        this.closeMessage(true);
    }

    showRounds () {
        this.props.showRounds();
        this.closeMessage(true);
    }

    newGame () {
        this.props.newGame();
        this.closeMessage();
    }

    render() {
        return (
            <div id="message" className={this.c.get("messageState")}>
                <div className="title h2">
                    <h2>Message</h2>
                    <button type="button" className="icon-cross" onClick={() => this.closeMessage(false)}></button>
                </div>

                <div className="container">
                    <div className="box1">
                        {
                            this.c.get('message').map((message, index) => (
                                <div key={index} className="box">{message}</div>
                            ))
                        }
                    </div>
                </div>

                <div className="container">
                    <div className={`box3 ${this.c.get("showVictory")}`}>
                        <button className="unselected" onClick={this.openSettings}>Settings</button>
                    </div>
                    <div className={`box3 ${this.c.get("showVictory")}`}>
                        <button className="unselected" onClick={this.showRounds}>Show Rounds</button>
                    </div>
                    <div className={`box3 ${this.c.get("showVictory")}`}>
                        <button className="plus" onClick={this.newGame}>New Game</button>
                    </div>
                    <div className={`box1 ${this.c.get("showError")}`}>
                        <button className="plus" onClick={() => this.closeMessage(false)}>okay :(</button>
                    </div>
                </div>
            </div>
        );
    }
}
export default withCookies(Error);