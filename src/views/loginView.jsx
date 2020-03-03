import React from 'react'
import { createStyles } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

const styles = (theme) => createStyles({})

const NotFoundView = (props) => {
    return <div>¯\_(ツ)_/¯</div>
}

export default withStyles(styles)(NotFoundView)
