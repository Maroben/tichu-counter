import React, { Component } from "react"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"
import { Switch, Route, Redirect } from "react-router-dom"

import Game from "./game"
import Rounds from "./common/game/rounds"
import Statistics from "./statistics"
import Games from "./common/stats/games"
import Settings from "./settings"
import NotFound from "./404"

import BottomNav from "./common/bottomNavigation"

const styles = (theme) => ({
	main: {
		margin: theme.spacing(2)
	},
	footer: {
		width: "100%",
		position: "fixed",
		bottom: 0
	}
})

const paths = ["/statistics", "/counter", "/settings"]

class Tichu extends Component {
	constructor(props) {
		super(props)
		this.state = {
			value: paths.indexOf(window.location.pathname),
			current: localStorage.getItem("Current")
				? JSON.parse(localStorage.getItem("Current"))
				: {
						data: "",
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
			games: localStorage.getItem("Games") ? JSON.parse(localStorage.getItem("Games")) : [],
			settings: {
				winPoints: 1000,
				over: false // Signifies if the game is over
			}
		}
	}

	handleGameData = (current, settings) => {
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

		return { current, settings }
	}

	handleData = (current) => {
		const { games, settings } = this.state
		const data = this.handleGameData(current, settings)

		this.setLocalStorage(data.current, games)

		this.setState({ current: data.current, settings: data.settings })
	}

	handleDelete = () => {
		const { current } = this.state
		if (current.rounds.length > 0) current.rounds.shift()
		this.handleData(current)
	}

	handleDeleteByIndex = (index) => {
		const { current } = this.state
		current.rounds.splice(index, 1)
		this.handleData(current)
	}

	handleDone = (round) => {
		const { current } = this.state
		current.rounds.unshift(round)
		this.handleData(current)
	}

	handleEdit = (round, index) => {
		const { current } = this.state
		current.rounds[index] = round
		this.handleData(current)
	}

	handleBottomNav = (event, value) => {
		this.setState({ value })
	}

	handleGameOver = () => {
		const { current, games } = this.state
		current.date = new Date()
		games.unshift(current)
		this.setState({ games })
		this.handleNewGame()
	}

	handleGameContinue = () => {
		const { settings } = this.state
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

		this.setLocalStorage(current, games)
		this.setState({ current, games, settings })
	}

	setLocalStorage = (current, games) => {
		localStorage.setItem("Current", JSON.stringify(current))
		localStorage.setItem("Games", JSON.stringify(games))
	}

	render() {
		const { value, current, games, settings } = this.state

		return (
			<React.Fragment>
				<Switch>
					<Route path="/statistics/games" render={(props) => <Games games={games} />} />
					<Route path="/statistics" render={(props) => <Statistics games={games} />} />
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
							<Game {...props} current={current} onEdit={this.handleEdit} />
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
