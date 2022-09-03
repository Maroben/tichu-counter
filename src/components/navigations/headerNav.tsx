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
    lgbtqBackground: {
      background: `linear-gradient(180deg, #FE0000 16.66%,
        #FD8C00 16.66%, 33.32%,
        #FFE500 33.32%, 49.98%,
        #119F0B 49.98%, 66.64%,
        #0644B3 66.64%, 83.3%,
        #C22EDC 83.3%)`,
    },
  });

interface Props extends WithStyles<typeof styles> {}

const HeaderNav = ({ classes: c }: Props) => {
  return (
    <AppBar position="sticky">
      <Toolbar className={c.lgbtqBackground}>
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
