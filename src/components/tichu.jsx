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
						score: 0,
						winner: -1
					},
					{
						name: "Phoenix",
						score: 0,
						winner: -1
					}
				],
				rounds: []
			},
			games: [],
			settings: {
				winPoints: 1000,
				over: false // Signifies if the game is over
			}
		}
		if (localStorage.getItem("Current") !== null) {
			this.state.current = JSON.parse(localStorage.getItem("Current"))
			this.state.games = JSON.parse(localStorage.getItem("Games"))
		}
	}

	handleGameData = (current) => {
		let { settings } = this.state

		// Calculate both team score
		current.team[0].score = 0
		current.team[1].score = 0
		current.rounds.forEach((round) => {
			current.team[0].score += round[0].betPoints + round[0].points
			current.team[1].score += round[1].betPoints + round[1].points
		})

		// Check if a Team has won or if it's a draw
		if (
			current.team[0].score >= settings.winPoints ||
			current.team[1].score >= settings.winPoints
		) {
			settings.over = true
			const dif = current.team[0].score - current.team[1].score
			if (dif > 0) {
				current.team[0].winner = 1
				current.team[1].winner = -1
			} else if (dif < 0) {
				current.team[0].winner = -1
				current.team[1].winner = 1
			} else {
				current.team[0].winner = 0
				current.team[1].winner = 0
			}
		}
		this.setState({ settings })
		return current
	}

	handleData = async (current) => {
		const { games, winPoints } = this.state
		current = await this.handleGameData(current, winPoints)
		localStorage.setItem("Current", JSON.stringify(current))
		localStorage.setItem("Games", JSON.stringify(games))
		this.setState({ current })
	}

	handleDelete = async () => {
		const { current } = this.state
		if (current.rounds.length > 0) current.rounds.shift()
		this.handleData(current)
	}

	handleDeleteByIndex = async (index) => {
		const { current } = this.state
		current.rounds.splice(index, 1)
		this.handleData(current)
	}

	handleDone = async (round) => {
		const { current } = this.state
		current.rounds.unshift(round)
		this.handleData(current)
	}

	handleEdit = async (round, index) => {
		const { current } = this.state
		current.rounds[index] = round
		this.handleData(current)
	}

	handleBottomNav = async (event, value) => {
		this.setState({ value })
	}

	handleGameOver = async () => {
		const { current, games } = this.state
		games.unshift(current)
		await this.setState({ games })
		this.handleNewGame()
	}

	handleGameContinue = () => {
		const { settings } = this.state
		console.log("continue")
		settings.over = false
		this.setState({ settings })
	}

	handleNewGame = () => {
		let { current, settings, games } = this.state
		settings.over = false
		current = {
			team: [
				{
					name: current.team[0].name,
					score: 0,
					winner: -1
				},
				{
					name: current.team[1].name,
					score: 0,
					winner: -1
				}
			],
			rounds: []
		}
		localStorage.setItem("Current", JSON.stringify(current))
		localStorage.setItem("Games", JSON.stringify(games))
		this.setState({ current, games, settings })
	}

	render() {
		const { value, current, settings } = this.state

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
							<Game
								{...props}
								current={current}
								over={settings.over}
								onDone={this.handleDone}
								onContinue={this.handleGameContinue}
								onGameOver={this.handleGameOver}
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
