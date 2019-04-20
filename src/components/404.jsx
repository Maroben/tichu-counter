import React from "react"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"

import Paper from "@material-ui/core/Paper"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"

const styles = (theme) => ({
	root: {
		...theme.mixins.gutters(),
		paddingTop: theme.spacing.unit * 2,
		paddingBottom: theme.spacing.unit * 2,
		margin: theme.spacing.unit * 2
	},
	message: {
		marginBottom: theme.spacing.unit * 2
	}
})

const NotFound = ({ classes, history }) => {
	const handleBack = () => {
		history.replace("/")
	}

	return (
		<React.Fragment>
			<Paper className={classes.root}>
				<Typography variant="body1" color="textPrimary" className={classes.message}>
					This resource doesn't exist.
				</Typography>
				<Button variant="contained" color="primary" onClick={handleBack}>
					Go to Home
				</Button>
			</Paper>
		</React.Fragment>
	)
}

NotFound.propTypes = {
	classes: PropTypes.object.isRequired
}

export default withStyles(styles)(NotFound)
