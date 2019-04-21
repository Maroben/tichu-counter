import React from "react"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"

import { Slider } from "@material-ui/lab"

const styles = (theme) => ({
	container: {
		margin: theme.spacing.unit * 2
	},
	slider: {
		touchAction: "pan-x"
	}
})

const PointsSlider = ({ classes, points, onSlide }) => {
	return (
		<div className={classes.container}>
			<Slider
				classes={{ container: classes.slider }}
				value={points}
				min={-25}
				max={125}
				step={5}
				onChange={onSlide}
			/>
		</div>
	)
}

PointsSlider.propTypes = {
	classes: PropTypes.object.isRequired
}

export default withStyles(styles)(PointsSlider)