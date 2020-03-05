import React from 'react'
import { createStyles, Theme } from '@material-ui/core'
import { WithStyles, withStyles } from '@material-ui/core/styles'

import { AppBar, Toolbar, Typography } from '@material-ui/core'

const styles = (theme: Theme) => createStyles({})

interface Props extends WithStyles<typeof styles> {}

const HeaderNav = (props: Props) => {
    return (
        <AppBar position="sticky">
            <Toolbar>
                <Typography variant="h5" color="inherit">
                    Tichu Counter
                </Typography>
            </Toolbar>
        </AppBar>
    )
}

export default withStyles(styles)(HeaderNav)
