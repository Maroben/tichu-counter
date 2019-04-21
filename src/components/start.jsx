import React, { Component } from "react"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"
import { Link } from "react-router-dom"

import Button from "@material-ui/core/Button"
import { Fab, Typography } from "@material-ui/core"
import AddIcon from "@material-ui/icons/Add"

const styles = (theme) => ({
	root: {
		width: "100%"
	},
	title: {
		marginBottom: theme.spacing.unit * 2
	},
	main: {
		margin: theme.spacing.unit * 2
	},
	button: {
		width: "100%",
		marginBottom: theme.spacing.unit * 2
	},
	fab: {
		position: "fixed",
		bottom: theme.spacing.unit * 2,
		right: theme.spacing.unit * 2
	}
})

class Start extends Component {
	state = {}
	render() {
		const { classes } = this.props

		return (
			<React.Fragment>
				<main className={classes.main}>
					<Typography variant="h6" align="center" className={classes.title}>
						Greatest Tichu Counter of all Time
					</Typography>
					<Button variant="contained" color="primary" className={classes.button}>
						Statistics
					</Button>
					<Button variant="contained" color="primary" className={classes.button} disabled>
						Resume Game
					</Button>
					<Fab
						color="secondary"
						aria-label="Add"
						component={Link}
						to={`/game`}
						className={classes.fab}
					>
						<AddIcon />
					</Fab>
				</main>
			</React.Fragment>
		)
	}
}

Start.propTypes = {
	classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Start)
