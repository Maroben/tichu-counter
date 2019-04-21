import React, { Component } from "react"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"
import { Link } from "react-router-dom"
import Header from "./common/header"
import { Card, CardContent, Typography, CardActionArea } from "@material-ui/core"

const styles = (theme) => ({
	main: {
		margin: theme.spacing.unit * 2
	},
	card: {
		marginBottom: theme.spacing.unit * 2
	},
	header: {
		paddingBottom: theme.spacing.unit
	},
	content: {}
})

class Statistics extends Component {
	state = {
		total: {
			count: 0,
			bets: [
				[0, 0], // First is total, second is successful
				[0, 0],
				[0, 0]
			],
			doubleVic: 0
		}
	}

	componentDidMount() {
		const { games } = this.props
		const { total } = this.state
		total.count = games.length
		games.forEach((game) => {
			game.rounds.forEach((round, index) => {
				round.forEach((team, index) => {
					team.bets.forEach((bet, index) => {
						if (bet !== 0) {
							total.bets[index][0] += 1
						}
						if (bet > 0) {
							total.bets[index][1] += 1
						}
					})
					if (team.double > 0) {
						total.doubleVic += 1
					}
				})
			})
		})

		this.setState({ total })
	}

	render() {
		const { classes } = this.props
		const { total } = this.state

		return (
			<React.Fragment>
				<Header title={"Tichu Statistics"} />
				<main className={classes.main}>
					<Card className={classes.card}>
						<CardContent className={classes.content}>
							<Typography variant="h5" color="default" className={classes.header}>
								General Statistics
							</Typography>
							<Typography variant="body1" color="default">
								{total.count} Games played
							</Typography>
							<Typography variant="body1" color="default">
								{total.bets[0][0]} big Tichu bets -> {total.bets[0][1]} successful
							</Typography>
							<Typography variant="body1" color="default">
								{total.bets[1][0] + total.bets[2][0]} small Tichu bets ->{" "}
								{total.bets[1][1] + total.bets[2][1]} successful
							</Typography>
							<Typography variant="body1" color="default">
								{total.doubleVic} Double Victories
							</Typography>
						</CardContent>
					</Card>
					<Card className={classes.card}>
						<CardActionArea to="/statistics/games" component={Link}>
							<CardContent className={classes.content}>
								<Typography variant="h5" color="default" className={classes.header}>
									Game History
								</Typography>
							</CardContent>
						</CardActionArea>
					</Card>
				</main>
			</React.Fragment>
		)
	}
}

Statistics.propTypes = {
	classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Statistics)
