import React from 'react'
import { Switch, Redirect } from 'react-router-dom'
import { createStyles, Theme } from '@material-ui/core'
import { WithStyles, withStyles } from '@material-ui/core/styles'

const styles = (theme: Theme) => createStyles({})

interface Props extends WithStyles<typeof styles> {}

const CounterController = (props: Props) => {
    return (
        <>
            <div>
                <Switch>
                    <Redirect to="/404" />
                </Switch>
            </div>
        </>
    )
}

export default withStyles(styles)(CounterController)
