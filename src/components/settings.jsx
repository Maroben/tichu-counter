import React, { Component } from "react"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"

import Header from "./common/header"

const styles = (theme) => ({
	root: {
		width: "100%"
	}
})

class Statistics extends Component {
	render() {
		const { classes } = this.props

		return (
			<React.Fragment>
				<Header title={"Tichu Statistics"} />
				<main className={classes.main}>Settings</main>
			</React.Fragment>
		)
	}
}

Statistics.propTypes = {
	classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Statistics)
