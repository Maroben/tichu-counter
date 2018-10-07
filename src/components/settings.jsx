import React, { Component } from 'react';
import './settings.css';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

class Settings extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    }

    constructor(props) {
        super(props);

        this.c = this.props.cookies;

        this.settings = {
            goal: this.c.get('goal') || 1000,
            aName: this.c.get('aName') || "Dragon",
            bName: this.c.get('bName') || "Phoenix"
        }

        this.changeSettings = this.changeSettings.bind(this);
        this.checkInput = this.checkInput.bind(this);

        this.openSettings = this.openSettings.bind(this);
        this.closeSettings = this.closeSettings.bind(this);

        this.saveSettings = this.saveSettings.bind(this);
        this.resetSettings = this.resetSettings.bind(this);
        this.newGame = this.newGame.bind(this);
    }

    openSettings() {
        this.c.set("settingsState", "");
    }
    
    changeSettings(event, id) {
        this.c.set(id, event.target.value);
    }

    checkInput() {
        if (this.c.get('goal') <= 0) { this.c.set('goal', 1000); }
        if (this.c.get('aName') === "") { this.c.set('aName', "Dragon"); }
        if (this.c.get('bName') <= 0) { this.c.set('bName', "Phoenix"); }
    }

    saveSettings() {
        this.checkInput();
        this.closeSettings(false);
    }

    resetSettings() {
        this.c.set('goal', 1000);
        this.c.set('aName', "Dragon");
        this.c.set('bName', "Phoenix");
        this.closeSettings(false);
    }

    newGame() {
        this.c.set("rounds", []);
        this.saveSettings();
    }

    closeSettings(abort) {
        if (abort) {
            this.c.set('goal', this.settings.goal);
            this.c.set('aName', this.settings.aName);
            this.c.set('bName', this.settings.bName);
        }
        this.c.set("settingsState", "hidden");
    }

    render() {
        return (
            <div id="settings" className={this.c.get("settingsState")}>
                <div className="title">
                    <h2>Settings</h2>
                    <button type="button" className="icon-cross" onClick={() => this.closeSettings(true)}></button>
                </div>
                <div className="settings-box">
                    <input type="text" value={this.c.get('aName')} onChange={(event) => this.changeSettings(event, "aName")} />
                    <div className="settings">vs</div>
                    <input type="text" value={this.c.get('bName')} onChange={(event) => this.changeSettings(event, "bName")} />
                </div>
                <div className="settings-box">
                    <div className="settings">predetermined score</div>
                    <input inputMode="numeric" value={this.c.get("goal")} onChange={(event) => this.changeSettings(event, "goal")} />
                </div>

                <div className="submit">
                    <button onClick={this.saveSettings}>Save</button>
                    <button onClick={this.resetSettings}>Reset</button>
                    <button onClick={this.newGame}>New</button>
                </div>
            </div>
        );
    }
}

export default withCookies(Settings);