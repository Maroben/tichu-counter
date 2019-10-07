import React from "react"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"

import { Typography } from "@material-ui/core"

const styles = (theme) => ({
	scoreBoard: {
		width: "100%"
	},
	borderLeft: {
		borderLeft: "0.5px solid grey",
		paddingLeft: theme.spacing()
	},
	borderRight: {
		borderRight: "0.5px solid grey",
		paddingRight: theme.spacing()
	}
})

const ScoreBoard = ({ classes, team, reverse }) => {
	return (
		<React.Fragment>
			{reverse && <div className={classes.borderLeft} />}
			<Typography className={classes.scoreBoard} variant="h5" color="primary">
				{reverse ? team.score : team.name}
			</Typography>
			<Typography className={classes.scoreBoard} variant="h5" align="right" color="primary">
				{reverse ? team.name : team.score}
			</Typography>
			{!reverse && <div className={classes.borderRight} />}
		</React.Fragment>
	)
}

ScoreBoard.propTypes = {
	classes: PropTypes.object.isRequired
}

export default withStyles(styles)(ScoreBoard)
