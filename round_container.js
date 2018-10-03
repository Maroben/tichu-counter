'use strict';

class Round extends React.Component {
    render() {
        return (
            <div class="game">
                <div class="game-box {this.props.a-big}"></div>
                <div class="game-box {this.props.a-small}"></div>
                <div class="game-box {this.props.a-neg}></div>
                <div class="game-box">{this.props.a-point}</div>
                <div class="game-box">&#x5BF9</div>
                <div class="game-box">{this.props.b-point}</div>
                <div class="game-box {this.props.b-neg}"></div>
                <div class="game-box {this.props.b-small}></div>
                <div class="game-box {this.props.b-big}"></div>
            </div>
        );
    }   
}

ReactDOM.render(<Round a-big="icon-plus" />,
               )