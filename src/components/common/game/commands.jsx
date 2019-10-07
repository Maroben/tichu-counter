import React from "react"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"
import { Link } from "react-router-dom"
import { Button } from "@material-ui/core"

import ClearIcon from "@material-ui/icons/Clear"
import CheckIcon from "@material-ui/icons/Check"
import ReorderIcon from "@material-ui/icons/Reorder"

const styles = (theme) => ({
	container: {
		display: "block"
	},
	icon: {
		paddingRight: theme.spacing()
	},
	button: {
		flexGrow: 1,
		marginRight: theme.spacing(2)
	},
	last: {
		marginRight: 0
	}
})

const Commands = ({ classes, edit, onReset, onEdit, onDone }) => {
	return (
		<React.Fragment>
			{!edit && (
				<React.Fragment>
					<Button
						color="default"
						component={Link}
						to="/counter/rounds"
						className={classes.button}
					>
						<ReorderIcon className={classes.icon} />
						Rounds
					</Button>
					<Button color="default" onClick={onReset} className={classes.button}>
						<ClearIcon /> Reset
					</Button>
					<Button
						variant="contained"
						color="primary"
						onClick={onDone}
						className={`${classes.button} ${classes.last}`}
					>
						<CheckIcon /> Done
					</Button>
				</React.Fragment>
			)}
			{edit && (
				<Button
					variant="contained"
					color="primary"
					onClick={onEdit}
					className={`${classes.button} ${classes.last}`}
				>
					<CheckIcon /> Done
				</Button>
			)}
		</React.Fragment>
	)
}

Commands.propTypes = {
	classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Commands)
