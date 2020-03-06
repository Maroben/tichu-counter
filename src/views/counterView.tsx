import React from 'react'
import { createStyles, Theme } from '@material-ui/core'
import { WithStyles, withStyles } from '@material-ui/core/styles'
import ISettings from '../models/ISettings'
import Game from '../models/Game'
import InputRound from '../components/counter/inputRound'

const styles = (theme: Theme) => createStyles({})

interface Props extends WithStyles<typeof styles> {
    settings: ISettings
    game: Game
}

const CounterView = ({ settings, game }: Props) => {
    return (
        <div>
            <InputRound />
        </div>
    )
}

export default withStyles(styles)(CounterView)
