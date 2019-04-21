import React, { Component } from "react"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"
import { Switch, Route, Redirect } from "react-router-dom"

import Game from "./game"
import Statistics from "./statistics"
import Settings from "./settings"
import NotFound from "./404"

import BottomNav from "./common/bottomNavigation"

const styles = (theme) => ({
	main: {
		margin: theme.spacing.unit * 2
	},
	footer: {
		width: "100%",
		position: "fixed",
		bottom: 0
	}
})

class Tichu extends Component {
	state = {
		value: 1,
		team: [
			{
				name: "Dragon",
				score: 0
			},
			{
				name: "Phoenix",
				score: 0
			}
		],
		current: [],
		games: []
	}

	handleDelete = () => {
		const { current } = this.state
		if (current.length > 0) current.pop()
		this.setState({ current })
	}

	handleDone = (round) => {
		const { current } = this.state
		current.push(round)
		this.setState({ current })
	}

	handleBottomNav = async (event, value) => {
		this.setState({ value })
	}

	render() {
		const { value, team, current } = this.state

		return (
			<React.Fragment>
				<Switch>
					<Route path="/statistics" render={(props) => <Statistics />} />
					<Route
						path="/counter"
						render={(props) => (
							<Game
								rounds={current}
								team={team}
								onDelete={this.handleDelete}
								onDone={this.handleDone}
							/>
						)}
					/>
					<Route path="/settings" render={(props) => <Settings />} />
					<Route path="/404" component={NotFound} />
					<Redirect from="/" to="/counter" exact />
					<Redirect to="/404" />
				</Switch>

				<BottomNav onNavigation={this.handleBottomNav} value={value} />
			</React.Fragment>
		)
	}
}

Tichu.propTypes = {
	classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Tichu)
