import React, { useState } from 'react';
import { createStyles, Theme } from '@material-ui/core';
import { WithStyles, withStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
const styles = (theme: Theme) => createStyles({});

interface Props extends WithStyles<typeof styles> {}

const StatisticsView = (props: Props) => {
  let [a, setA] = useState(0);
  return <Button onClick={() => setA(++a)}>{a}</Button>;
};

export default withStyles(styles)(StatisticsView);
