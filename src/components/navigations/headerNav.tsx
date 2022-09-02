import React from 'react';
import { Link } from 'react-router-dom';
import { createStyles, Theme } from '@material-ui/core';
import { WithStyles, withStyles } from '@material-ui/core/styles';

import { AppBar, Toolbar, Typography, IconButton } from '@material-ui/core';

import PersonIcon from '@material-ui/icons/PersonSharp';

const styles = (theme: Theme) =>
  createStyles({
    title: {
      flexGrow: 1,
      textDecoration: 'none',
    },
  });

interface Props extends WithStyles<typeof styles> {}

const HeaderNav = ({ classes: c }: Props) => {
  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h5" color="inherit" className={c.title} component={Link} to="/">
          Tichu Counter
        </Typography>
        <IconButton color="inherit" component={Link} to="/u">
          <PersonIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default withStyles(styles)(HeaderNav);
