import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'

import { CssBaseline } from '@material-ui/core'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'

import TichuController from './controllers/tichuController'
import LoginView from './views/loginView'
import RegisterView from './views/registerView'
import NotFoundView from './views/notFoundView'

const theme = createMuiTheme({
    palette: {
        primary: { main: '#1b5e20' },
        secondary: { main: '#dd2c00' }
    }
})

class App extends Component {
    render() {
        return (
            <>
                <MuiThemeProvider theme={theme}>
                    <CssBaseline />
                    <Switch>
                        <Route path="/login" component={LoginView} />
                        <Route path="/register" component={RegisterView} />
                        <Route path="/404" component={NotFoundView} />
                        <Route path="/" component={TichuController} />
                    </Switch>
                </MuiThemeProvider>
            </>
        )
    }
}

export default App
