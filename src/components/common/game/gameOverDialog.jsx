import React, { Component } from "react"
import { Link } from "react-router-dom"

import {
	Button,
	Dialog,
	DialogTitle,
	DialogActions,
	DialogContent,
	DialogContentText
} from "@material-ui/core"

class GameOverDialog extends Component {
	state = {
		open: true
	}

	handleClose = () => {
		this.setState({ open: false })
		this.props.onGameOver()
	}

	getMessage = (current) => {
		let over = true
		let message = ["", ""]

		if (current.team[0].winner === 1) {
			message[0] = current.team[0].name + " has won the Game!"
			message[1] = "Start a new Game now?"
		} else if (current.team[1].winner === 1) {
			message[0] = current.team[1].name + " has won the Game!"
			message[1] = "Start a new Game now?"
		} else {
			over = false
			message[0] = "It is a draw!"
			message[1] = "Do you want to continue playing?"
		}
		return { message, over }
	}

	render() {
		const { current, onGameOver, onContinue } = this.props
		const { message, over } = this.getMessage(current)
		return (
			<div>
				<Dialog
					open={this.state.open}
					onClose={this.handleClose}
					aria-labelledby="alert-dialog-title"
					aria-describedby="alert-dialog-description"
				>
					<DialogTitle id="alert-dialog-title">{message[0]}</DialogTitle>
					<DialogContent>
						<DialogContentText id="alert-dialog-description">
							{message[1]}
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						{over && (
							<Button
								to="/statistics"
								onClick={onGameOver}
								component={Link}
								color="secondary"
							>
								Statistics
							</Button>
						)}
						{!over && (
							<Button onClick={onContinue} color="secondary">
								Continue Playing
							</Button>
						)}
						<Button
							to="/counter"
							onClick={onGameOver}
							component={Link}
							color="primary"
							autoFocus
						>
							New Game
						</Button>
					</DialogActions>
				</Dialog>
			</div>
		)
	}
}

export default GameOverDialog
