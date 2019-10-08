import React, { Component } from "react"

import Tichu from "./components/tichu"

import CssBaseline from "@material-ui/core/CssBaseline"
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles"

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
					<Tichu />
				</MuiThemeProvider>
			</React.Fragment>
		)
	}
}

export default App
