import React, { Component } from "react"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"

import BottomNav from "./common/bottomNavigation"

import Game from "./game"
import Statistics from "./statistics"
import Settings from "./settings"

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
		console.log(current)
		this.setState({ current })
	}

	handleDone = (round) => {
		const { current } = this.state
		current.push(round)
		console.log(current)
		this.setState({ current })
	}

	handleBottomNav = (event, value) => {
		this.setState({ value })
	}

	render() {
		const { value, team, current } = this.state

		return (
			<React.Fragment>
				{value === 0 && <Statistics />}
				{value === 1 && (
					<Game
						rounds={current}
						team={team}
						onDelete={this.handleDelete}
						onDone={this.handleDone}
					/>
				)}
				{value === 2 && <Settings />}

				<BottomNav handlers={this.handleBottomNav} value={value} />
			</React.Fragment>
		)
	}
}

Tichu.propTypes = {
	classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Tichu)
