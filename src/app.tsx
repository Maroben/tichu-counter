import React, { Component } from "react"
import { Route, Switch } from "react-router-dom"

import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles"
import { withStyles } from "@material-ui/core/styles"
import { createStyles, CssBaseline } from "@material-ui/core"

import CounterController from "./controllers/counterController"
import LoginView from "./views/loginView"
import RegisterView from "./views/registerView"

const theme = createMuiTheme({
    palette: {
        primary: { main: "#2196f3" },
        secondary: { main: "#ff3d00" }
    }
})

const styles = () => createStyles({})

class App extends Component {
    render() {
        return (
            <MuiThemeProvider theme={theme}>
                <CssBaseline />
                <Switch>
                    <Route path="/login" component={LoginView} />
                    <Route path="/register" component={RegisterView} />

                    <Route path="/" component={CounterController} />
                </Switch>
            </MuiThemeProvider>
        )
    }
}

export default withStyles(styles)(App)
