import React, { Component } from "react"
import { ToastContainer } from "react-toastify"

import Tichu from "./components/tichu"

import CssBaseline from "@material-ui/core/CssBaseline"
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles"
import "react-toastify/dist/ReactToastify.css"

const theme = createMuiTheme({
	typography: {
		useNextVariants: true
	}
})

class App extends Component {
	render() {
		return (
			<React.Fragment>
				<MuiThemeProvider theme={theme}>
					<CssBaseline />
					<ToastContainer />
					<Tichu />
				</MuiThemeProvider>
			</React.Fragment>
		)
	}
}

export default App
