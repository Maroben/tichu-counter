import React from "react"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"
import { Link } from "react-router-dom"
import { BottomNavigation, BottomNavigationAction } from "@material-ui/core"

import ShowChart from "@material-ui/icons/ShowChart"
import GamesIcon from "@material-ui/icons/Games"
import SettingsIcon from "@material-ui/icons/Settings"

const styles = (theme) => ({
	footer: {
		width: "100%",
		position: "fixed",
		bottom: 0
	}
})

const BottomNav = ({ classes, onNavigation, value }) => {
	return (
		<footer>
			<BottomNavigation
				value={value}
				onChange={onNavigation}
				showLabels
				sticky="bottom"
				className={classes.footer}
			>
				<BottomNavigationAction
					to="/statistics"
					component={Link}
					label="Statistics"
					icon={<ShowChart />}
				/>

				<BottomNavigationAction
					to="/counter"
					component={Link}
					label="Counter"
					icon={<GamesIcon />}
				/>

				<BottomNavigationAction
					to="/settings"
					component={Link}
					label="Settings"
					icon={<SettingsIcon />}
				/>
			</BottomNavigation>
		</footer>
	)
}

BottomNav.propTypes = {
	classes: PropTypes.object.isRequired
}

export default withStyles(styles)(BottomNav)
