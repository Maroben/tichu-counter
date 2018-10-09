import React, { Component } from 'react';
import './message.scss';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

class Error extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };
    constructor(props) {
        super(props);

        this.c = this.props.cookies;

        this.closeMessage = this.closeMessage.bind(this);
        this.newGame = this.newGame.bind(this);
    }

    closeMessage () {
        this.c.set('messageState', "hidden", { path: '/' });
    }

    newGame () {
        this.props.newGame();
        this.closeMessage();
    }

    render() {
        return (
            <div id="message" className={this.c.get("messageState")}>
                <div className="title">
                    <h2>Message</h2>
                    <button type="button" className="icon-cross" onClick={this.closeMessage}></button>
                </div>
                <div className="box">{this.c.get('message')}</div>
                <div className="submit">
                    <div className={`box ${this.c.get("submitNewGame")}`}><button className="reset" onClick={this.newGame}>New Game</button></div>
                </div>
            </div>
        );
    }
}
export default withCookies(Error);