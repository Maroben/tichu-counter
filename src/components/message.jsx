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
        this.newGame = this.newGame.bind(this);
        this.openSettings = this.openSettings.bind(this);

    }

    setVictory() {
        this.c.set('submitNewGame', '', { path: '/' });
        this.c.set("messageState", '', { path: '/' });
        this.c.set("submitState", "hidden", { path: '/' });
    }

    setError() {
        this.c.set('submitNewGame', '', { path: '/' });
        this.c.set("messageState", '', { path: '/' });
        this.c.set("submitState", "hidden", { path: '/' });
    }

    closeMessage () {
        this.c.set('messageState', "hidden", { path: '/' });
        this.c.set('submitNewGame', 'hidden', { path: '/' });
        this.c.set('showError', 'hidden', { path: '/' });
        this.c.set("submitState", "", { path: '/' });
    }

    newGame () {
        this.props.newGame();
        this.closeMessage();
    }

    openSettings () {
        this.props.openSettings();
        this.closeMessage();
    }

    render() {
        return (
            <div id="message" className={this.c.get("messageState")}>
                <div className="title h2">
                    <h2>Message</h2>
                    <button type="button" className="icon-cross" onClick={this.closeMessage}></button>
                </div>

                <div className="container">
                    <div className="box1">
                        <div className="box">{this.c.get('message')}</div>
                    </div>
                </div>

                <div className="container">
                    <div className={`box3 ${this.c.get("submitNewGame")}`}>
                        <button className="unselected" onClick={this.openSettings}>Settings</button>
                    </div>
                    <div className={`box3 ${this.c.get("submitNewGame")}`}>
                        <button className="unselected" onClick={this.showHistory}>Show Rounds</button>
                    </div>
                    <div className={`box3 ${this.c.get("submitNewGame")}`}>
                        <button className="plus" onClick={this.newGame}>New Game</button>
                    </div>
                    <div className={`box1 ${this.c.get("showError")}`}>
                        <button className="plus" onClick={this.closeMessage}>Okay</button>
                    </div>
                </div>
            </div>
        );
    }
}
export default withCookies(Error);