import React from "react"
import { createStyles, Theme } from "@material-ui/core"
import { WithStyles, withStyles } from "@material-ui/core/styles"

import { Button } from "@material-ui/core"

const styles = (theme: Theme) =>
    createStyles({
        button: {
            width: "100%"
        }
    })

interface Props extends WithStyles<typeof styles> {
    color: string
}

const StyledButton = ({ color, classes }: Props) => {
    return <Button className={classes.button}></Button>
}

export default withStyles(styles)(StyledButton)
