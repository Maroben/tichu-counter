import React, { Component } from "react"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"

import Header from "./common/header"
import ScoreBoard from "./common/game/scoreBoard"
import Scores from "./common/game/scores"
import PointsSlider from "./common/game/pointsSlider"
import Bets from "./common/game/bets"
import Commands from "./common/game/commands"
import Rounds from "./common/game/rounds"

const styles = (theme) => ({
	root: {
		width: "100%"
	},
	scoreBoard: {
		display: "flex",
		marginBottom: theme.spacing.unit * 2
	},
	title: {
		marginBottom: theme.spacing.unit * 2
	},
	main: {
		margin: theme.spacing.unit * 2
	},
	score: {
		display: "flex",
		marginBottom: theme.spacing.unit * 2
	},
	bets: {
		display: "flex",
		flexGrow: 1,
		marginBottom: theme.spacing.unit * 2
	},
	points: {
		display: "block",
		height: theme.spacing.unit * 2,
		marginTop: theme.spacing.unit * 3,
		marginBottom: theme.spacing.unit * 2
	},
	commands: {
		display: "flex",
		marginBottom: theme.spacing.unit * 2
	},
	bottom: {
		position: "fixed",
		bottom: theme.spacing.unit * 7,
		left: theme.spacing.unit * 2,
		right: theme.spacing.unit * 2
	},
	middle: {
		width: theme.spacing.unit * 4
	}
})

class Game extends Component {
	state = {
		slideDisabled: false,
		roundsOn: false,
		round: [
			{
				bets: [0, 0, 0],
				betsOff: [false, false, false],
				betPoints: 0,
				points: 50,
				double: 0
			},
			{
				bets: [0, 0, 0],
				betsOff: [false, false, false],
				betPoints: 0,
				points: 50,
				double: 0
			}
		]
	}

	handleBet = (team, bet) => {
		const { round } = this.state
		const { bets } = this.state.round[team]
		const teamB = (team + 1) % 2
		const both = round[team].bets.concat(round[teamB].bets)

		// Do not allow more than one successful tichu
		if (both.includes(1) && both.filter((b) => b === -1).length < 3) {
			round[team].bets[bet] = bets[bet] > -1 ? -1 : 0
		}
		// As well as a maximum of 3 unsuccessful onces
		else if (bets[bet] > -1 && both.filter((b) => b === -1).length > 2) {
			round[team].bets[bet] = bets[bet] > 0 ? 0 : 1
		} else {
			round[team].bets[bet] = bets[bet] > 0 ? -1 : ++bets[bet]
		}

		// Do not allow more than two tichu bets for each team
		if (round[team].bets.filter((b) => b !== 0).length > 1) {
			round[team].betsOff[round[team].bets.indexOf(0)] = true
		} else {
			round[team].betsOff = [false, false, false]
		}

		if (round[team].bets) round[team].betPoints = bets[0] * 200 + bets[1] * 100 + bets[2] * 100

		this.setState(round)
	}

	handleDouble = (team) => {
		let { round, slideDisabled } = this.state
		const teamB = (team + 1) % 2
		round[team].double = (round[team].double + 1) % 2

		if (round[team].double > 0) {
			round[team].points = 200
			round[teamB].double = 0
			round[teamB].points = 0
			slideDisabled = true
		} else {
			round[team].points = 50
			round[teamB].points = 50
			slideDisabled = false
		}

		this.setState({ round, slideDisabled })
	}

	handleSlide = (event, points) => {
		const { round } = this.state
		round[1].points = points
		round[0].points = 100 - points
		this.setState({ round })
	}

	handleReset = () => {
		let { round, slideDisabled } = this.state
		slideDisabled = false
		round = [
			{
				bets: [0, 0, 0],
				betsOff: [false, false, false],
				betPoints: 0,
				points: 50,
				double: 0
			},
			{
				bets: [0, 0, 0],
				betsOff: [false, false, false],
				betPoints: 0,
				points: 50,
				double: 0
			}
		]
		this.setState({ round, slideDisabled })
	}

	handleRounds = () => {
		this.setState({ roundsOn: !this.state.roundsOn })
	}

	render() {
		const { classes, rounds, team, onDelete, onDone } = this.props
		const { round, slideDisabled, roundsOn } = this.state

		return (
			<React.Fragment>
				<Header title={"Tichu Counter"} />

				<main className={classes.main}>
					<div className={classes.scoreBoard}>
						<ScoreBoard team={team[0]} reverse={false} />
						<ScoreBoard team={team[1]} reverse={true} />
					</div>
					{!roundsOn && (
						<div className={classes.bottom}>
							<div className={classes.score}>
								<Scores points={round[0].points} betPoints={round[0].betPoints} />
								<div className={classes.middle} />
								<Scores points={round[1].points} betPoints={round[1].betPoints} />
							</div>

							<div className={classes.bets}>
								<Bets
									onBet={this.handleBet}
									onDouble={this.handleDouble}
									bets={round[0].bets}
									betsOff={round[0].betsOff}
									double={round[0].double}
									team={0}
								/>
								<div className={classes.middle} />
								<Bets
									onBet={this.handleBet}
									onDouble={this.handleDouble}
									bets={round[1].bets}
									betsOff={round[1].betsOff}
									double={round[1].double}
									team={1}
								/>
							</div>

							{!slideDisabled && (
								<div className={classes.points}>
									<PointsSlider
										onSlide={this.handleSlide}
										points={round[1].points}
									/>
								</div>
							)}

							<div className={classes.commands}>
								<Commands
									onRounds={this.handleRounds}
									onReset={this.handleReset}
									onDone={() => onDone(round)}
								/>
							</div>
						</div>
					)}
					{roundsOn && <Rounds rounds={rounds} onDelete={onDelete} />}
				</main>
			</React.Fragment>
		)
	}
}

Game.propTypes = {
	classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Game)