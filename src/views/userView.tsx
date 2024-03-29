import React from 'react';
import { Link } from 'react-router-dom';
import { createStyles, Theme, Divider } from '@material-ui/core';
import { WithStyles, withStyles } from '@material-ui/core/styles';

import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';

import PersonIcon from '@material-ui/icons/PersonSharp';
import SettingsIcon from '@material-ui/icons/SettingsSharp';
import SettingsBackupRestoreIcon from '@material-ui/icons/SettingsBackupRestore';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(2),
      marginBottom: theme.spacing(10),
    },
    card: {
      marginBottom: theme.spacing(2),
    },
    actions: {
      justifyContent: 'flex-end',
    },
    submit: {
      marginLeft: `${theme.spacing(2)}px !important`,
    },
  });

interface Props extends WithStyles<typeof styles> {
  resetGame: () => unknown;
}

const UserView = ({ classes, resetGame }: Props) => {
  return (
    <div className={classes.root}>
      <List component="nav">
        <ListItem button component={Link} to="/u/login">
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary="Account" secondary="Share and Backup your data" />
        </ListItem>
        <Divider />
        <ListItem button component={Link} to="/u/settings">
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" secondary="Tichu Counter Controls" />
        </ListItem>
        <Divider />
        <ListItem button onClick={resetGame}>
          <ListItemIcon>
            <SettingsBackupRestoreIcon />
          </ListItemIcon>
          <ListItemText primary="New Game" secondary="Reset current game" />
        </ListItem>
      </List>
    </div>
  );
};

export default withStyles(styles)(UserView);
