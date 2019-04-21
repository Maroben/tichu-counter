import React, { Component } from "react"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"
import { Switch, Route, Redirect } from "react-router-dom"

import Game from "./game"
import Rounds from "./common/game/rounds"
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
	constructor(props) {
		super(props)
		this.state = {
			value: 1,
			current: {
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
				rounds: []
			},
			games: []
		}
		if (localStorage.getItem("Current") !== null) {
			this.state.current = JSON.parse(localStorage.getItem("Current"))
			this.state.games = JSON.parse(localStorage.getItem("Games"))
		}
	}

	calculateScore = async (current) => {
		current.team[0].score = 0
		current.team[1].score = 0
		current.rounds.forEach((round) => {
			current.team[0].score += round[0].betPoints + round[0].points
			current.team[1].score += round[1].betPoints + round[1].points
		})
		await this.setState({ current })
	}

	handleData = () => {
		const { current, games } = this.state

		localStorage.setItem("Current", JSON.stringify(current))
		localStorage.setItem("Games", JSON.stringify(games))
	}

	handleDelete = async () => {
		const { current } = this.state
		if (current.rounds.length > 0) current.rounds.shift()
		await this.calculateScore(current)
		this.handleData()
	}

	handleDeleteByIndex = async (index) => {
		const { current } = this.state
		current.rounds.splice(index, 1)
		await this.calculateScore(current)
		this.handleData()
	}

	handleDone = async (round) => {
		const { current } = this.state
		current.rounds.unshift(round)
		await this.calculateScore(current)
		this.handleData()
	}

	handleEdit = async (round, index) => {
		const { current } = this.state
		current.rounds[index] = round
		await this.calculateScore(current)
		this.handleData()
	}

	handleBottomNav = async (event, value) => {
		this.setState({ value })
	}

	render() {
		const { value, current } = this.state

		return (
			<React.Fragment>
				<Switch>
					<Route path="/statistics" render={(props) => <Statistics />} />
					<Route
						path="/counter/rounds"
						render={(props) => (
							<Rounds
								{...props}
								current={current}
								onDeleteByIndex={this.handleDeleteByIndex}
							/>
						)}
					/>
					<Route
						path="/counter/edit"
						render={(props) => (
							<Game
								{...props}
								team={current.team}
								rounds={current.rounds}
								onEdit={this.handleEdit}
								onDone={this.handleDone}
							/>
						)}
					/>
					<Route
						path="/counter"
						render={(props) => (
							<Game {...props} team={current.team} onDone={this.handleDone} />
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
