import React from 'react';
import './form.css';

function Form(props) {
    return (
        <footer>
            <div className="game">
                <div className="game-box"><button type="button" name="a-big" className="box3 {props.form.teamA.big}"></button></div>
                <div className="game-box"><button type="button" name="a-small" className="box3 {props.form.teamA.small}"></button></div>
                <div className="game-box"><input type="number" name="a-point" inputmode="numeric" />{props.form.teamA.points}</div>
                <div id="vs" class="game-box">&#x5BF9</div>
                <div className="game-box"><input type="number" name="b-point" inputmode="numeric" />{props.form.teamB.points}</div>
                <div className="game-box"><button type="button" name="b-small" className="box3 {props.form.teamB.small}"></button></div>
                <div className="game-box"><button type="button" name="b-big" className="box3 {props.form.teamB.small}"></button></div>
            </div>

            <div className="submit">
                <button id="submit" type="submit" className="icon-checkmark" onClick={this.saveForm}></button>
                <button id="reset" type="reset" className="icon-undo" onClick={this.resetForm}></button>
                <button id="delete" className="icon-bin" onClick={this.deleteLastEntry}></button>
            </div>
        </footer>
    );
}

export default Form;