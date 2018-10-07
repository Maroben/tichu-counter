import React, { Component } from 'react';
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
    }

    closeMessage () {
        this.c.set('errorState', "");
    }

    render() {
        return (
            <div id="error" className={this.c.get('errorState')}>
                <h2>{this.c.get('errorMessage')}</h2>
                <button type="button" className="icon-cross" onClick={() => this.closeMessage()}></button>
            </div>
        );
    }
}
export default withCookies(Error);