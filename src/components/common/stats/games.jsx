import React from "react"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"
import { Link } from "react-router-dom"

import Header from "../header"

import { Card, CardActionArea, CardContent, Typography } from "@material-ui/core"

const styles = (theme) => ({
	main: {
		margin: theme.spacing.unit * 2
	},
	card: {
		marginBottom: theme.spacing.unit * 2
	}
})

const Games = ({ classes, games }) => {
	return (
		<React.Fragment>
			<Header title={"Games Played"} />
			<main className={classes.main}>
				{games.map((game, index) => (
					<Card key={index} className={classes.card}>
						<CardActionArea>
							<CardContent className={classes.content}>
								<Typography variant="h5" color="primary">
									{game.team[0].name} ({game.team[0].score}) vs (
									{game.team[1].score}) {game.team[1].name}
								</Typography>
								<Typography variant="h6" color="secondary">
									{game.date}
								</Typography>
							</CardContent>
						</CardActionArea>
					</Card>
				))}
			</main>
		</React.Fragment>
	)
}

Games.propTypes = {
	classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Games)
