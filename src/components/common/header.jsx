import React from "react"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"

import { AppBar, Toolbar, Typography } from "@material-ui/core"

const styles = (theme) => ({
	root: {
		width: "100%"
	},
	title: {
		display: "block",
		width: "100%"
	},
	icon: {
		margin: theme.spacing.unit,
		fontSize: 32
	}
})

const Header = ({ classes, title }) => {
	return (
		<AppBar position="static" className={classes.root}>
			<Toolbar>
				<Typography className={classes.title} variant="h6" color="inherit" noWrap>
					{title}
				</Typography>
			</Toolbar>
		</AppBar>
	)
}

Header.propTypes = {
	classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Header)
