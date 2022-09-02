import React from 'react';
import { createStyles, Theme } from '@material-ui/core';
import { WithStyles, withStyles } from '@material-ui/core/styles';

const styles = (theme: Theme) => createStyles({});

interface Props extends WithStyles<typeof styles> {}

const LoginView = (props: Props) => {
  return <div>¯\_(ツ)_/¯</div>;
};

export default withStyles(styles)(LoginView);
