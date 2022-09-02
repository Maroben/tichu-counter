import React from 'react';
import { Link } from 'react-router-dom';
import { createStyles, Theme } from '@material-ui/core';
import { WithStyles, withStyles } from '@material-ui/core/styles';

import { Card, CardContent, CardActions, Button, Typography } from '@material-ui/core';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(2),
    },
    card: {
      maxWidth: '500px',
      width: '100%',
      margin: '0 auto',
      padding: theme.spacing(2),
    },
    title: {
      textAlign: 'center',
    },
    button: {
      justifyContent: 'center',
    },
  });

interface Props extends WithStyles<typeof styles> {}

const NotFoundView = ({ classes: c }: Props) => {
  return (
    <div className={c.root}>
      <Card className={c.card}>
        <CardContent>
          <Typography variant="h4" className={c.title}>
            ¯\_(ツ)_/¯
          </Typography>
          <Typography variant="h6" className={c.title}>
            404 | Page not Found
          </Typography>
        </CardContent>
        <CardActions className={c.button}>
          <Button variant="contained" color="primary" component={Link} to="/">
            BACK TO THE COUNTER
          </Button>
        </CardActions>
      </Card>
    </div>
  );
};

export default withStyles(styles)(NotFoundView);
