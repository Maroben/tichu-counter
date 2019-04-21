import React from "react"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"
import { Link } from "react-router-dom"
import Header from "../header"

import {
	Button,
	Grid,
	Divider,
	Paper,
	Typography,
	Card,
	CardContent,
	CardActions
} from "@material-ui/core"
import SuccessIcon from "@material-ui/icons/CheckBox"
import NeutralIcon from "@material-ui/icons/CheckBoxOutlineBlank"
import FailedIcon from "@material-ui/icons/IndeterminateCheckBox"

const styles = (theme) => ({
	main: {
		margin: theme.spacing.unit * 2
	},
	card: {
		marginBottom: theme.spacing.unit * 2,
		minWidth: 300,
		[theme.breakpoints.up("md")]: {
			width: 300
		}
	},
	content: {
		paddingBottom: 0
	},
	grid: {
		verticalAlign: "middle"
	},
	item: {
		verticalAlign: "middle",
		textAlign: "center"
	},
	empty: {
		...theme.mixins.gutters(),
		paddingTop: theme.spacing.unit * 2,
		paddingBottom: theme.spacing.unit * 2
	},
	button: {
		marginTop: theme.spacing.unit
	},
	divider: {
		margin: `${theme.spacing.unit}px 0`
	}
})

let icon = [<FailedIcon color="secondary" />, <NeutralIcon />, <SuccessIcon color="primary" />]

const Rounds = ({ classes, history, current, onDeleteByIndex }) => {
	return (
		<React.Fragment>
			<Header title={"Rounds"} back={true} />
			<main className={classes.main}>
				{current.rounds.length === 0 && (
					<Paper className={classes.empty} elevation={1}>
						<Typography variant="body1">You didn't play any rounds yet.</Typography>
						<Button
							color="primary"
							className={classes.button}
							onClick={() => history.goBack()}
						>
							Go back to the Counter
						</Button>
					</Paper>
				)}
				{current.rounds.map((round, index) => (
					<Card key={index} className={classes.card}>
						<CardContent className={classes.content}>
							<Grid container spacing={24} className={classes.grid}>
								<Grid item xs={2} className={classes.item}>
									Team
								</Grid>
								<Grid item xs={2} className={classes.item}>
									Total
								</Grid>
								<Grid item xs={2} className={classes.item}>
									Points
								</Grid>
								<Grid item xs={2} className={classes.item}>
									Big
								</Grid>
								<Grid item xs={2} className={classes.item}>
									Small
								</Grid>
								<Grid item xs={2} className={classes.item}>
									Small
								</Grid>
							</Grid>
							<Divider className={classes.divider} />
							<Grid container spacing={24} className={classes.grid}>
								<Grid item xs={2} className={classes.item}>
									{current.team[0].name}
								</Grid>
								<Grid item xs={2} className={classes.item}>
									{round[0].points + round[0].betPoints}
								</Grid>
								<Grid item xs={2} className={classes.item}>
									{round[0].points}
								</Grid>
								<Grid item xs={2} className={classes.item}>
									{icon[round[0].bets[0] + 1]}
								</Grid>
								<Grid item xs={2} className={classes.item}>
									{icon[round[0].bets[1] + 1]}
								</Grid>
								<Grid item xs={2} className={classes.item}>
									{icon[round[0].bets[2] + 1]}
								</Grid>
							</Grid>
							<Grid container spacing={24} className={classes.grid}>
								<Grid item xs={2} className={classes.item}>
									{current.team[1].name}
								</Grid>
								<Grid item xs={2} className={classes.item}>
									{round[1].points + round[1].betPoints}
								</Grid>
								<Grid item xs={2} className={classes.item}>
									{round[1].points}
								</Grid>
								<Grid item xs={2} className={classes.item}>
									{icon[round[1].bets[0] + 1]}
								</Grid>
								<Grid item xs={2} className={classes.item}>
									{icon[round[1].bets[1] + 1]}
								</Grid>
								<Grid item xs={2} className={classes.item}>
									{icon[round[1].bets[2] + 1]}
								</Grid>
							</Grid>
						</CardContent>

						<CardActions>
							<Button
								size="small"
								color="secondary"
								onClick={() => onDeleteByIndex(index)}
							>
								delete
							</Button>
							<Button
								size="small"
								color="primary"
								to={`/counter/edit?index=${index}`}
								component={Link}
							>
								edit
							</Button>
						</CardActions>
					</Card>
				))}
			</main>
		</React.Fragment>
	)
}

Rounds.propTypes = {
	classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Rounds)
