import React from "react"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"

import { Typography } from "@material-ui/core"

const styles = (theme) => ({
	score: {
		width: "100%"
	}
})

const Scores = ({ classes, points, betPoints }) => {
	return (
		<React.Fragment>
			<Typography className={classes.score} variant="h5" align="center" color="secondary">
				{points + betPoints} ({points})
			</Typography>
		</React.Fragment>
	)
}

Scores.propTypes = {
	classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Scores)
