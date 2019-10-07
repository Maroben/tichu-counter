import React from "react"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"

import { Button } from "@material-ui/core"

const styles = (theme) => ({
	container: {
		display: "block"
	},
	button: {
		width: "100%",
		marginBottom: theme.spacing()
	}
})

const colorBets = ["secondary", "default", "primary"]
const colorDouble = ["default", "primary"]

const Bets = ({ classes, onBet, onDouble, bets, betsOff, double, team }) => {
	return (
		<div className={classes.container}>
			<Button
				variant="contained"
				disabled={betsOff[0]}
				color={colorBets[bets[0] + 1]}
				className={classes.button}
				onClick={() => onBet(team, 0)}
			>
				Big Tichu
			</Button>
			<Button
				variant="contained"
				disabled={betsOff[1]}
				color={colorBets[bets[1] + 1]}
				className={classes.button}
				onClick={() => onBet(team, 1)}
			>
				Small Tichu
			</Button>
			<Button
				variant="contained"
				disabled={betsOff[2]}
				color={colorBets[bets[2] + 1]}
				className={classes.button}
				onClick={() => onBet(team, 2)}
			>
				Small Tichu
			</Button>
			<Button
				variant="contained"
				color={colorDouble[double]}
				className={classes.button}
				onClick={() => onDouble(team)}
			>
				Double Victory
			</Button>
		</div>
	)
}

Bets.propTypes = {
	classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Bets)
