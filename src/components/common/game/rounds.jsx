import React from "react"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"

import { Button, Typography, Card, CardContent, CardActions } from "@material-ui/core"
import SuccessIcon from "@material-ui/icons/CheckBox"
import NeutralIcon from "@material-ui/icons/CheckBoxOutlineBlank"
import FailedIcon from "@material-ui/icons/IndeterminateCheckBox"

const styles = (theme) => ({
	card: {
		marginBottom: theme.spacing.unit * 2,
		minWidth: 300,
		[theme.breakpoints.up("md")]: {
			width: 300
		}
	},
	content: {
		padding: 0
	}
})

let cardKey = 0
let icon = [
	<FailedIcon color="secondary" />,
	<NeutralIcon color="default" />,
	<SuccessIcon color="primary" />
]

const Rounds = ({ classes, rounds, onDelete }) => {
	return (
		<React.Fragment>
			{rounds.map((round) => (
				<Card key={cardKey++} className={classes.card}>
					<CardContent>
						<Typography className={classes.content} color="textPrimary">
							{round[0].points} {icon[round[0].bets[0] + 1]}{" "}
							{icon[round[0].bets[1] + 1]} {icon[round[0].bets[2] + 1]}
						</Typography>
						<Typography className={classes.content} color="textPrimary">
							{round[1].points} {icon[round[1].bets[0] + 1]}{" "}
							{icon[round[1].bets[1] + 1]} {icon[round[1].bets[2] + 1]}
						</Typography>
					</CardContent>

					<CardActions>
						<Button size="small" color="secondary">
							delete
						</Button>
						<Button size="small" color="primary">
							edit
						</Button>
					</CardActions>
				</Card>
			))}
		</React.Fragment>
	)
}

Rounds.propTypes = {
	classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Rounds)
