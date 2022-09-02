import React from 'react';
import { createStyles, Theme } from '@material-ui/core';
import { WithStyles, withStyles } from '@material-ui/core/styles';
import ISettings from '../models/Settings';
import Game from '../models/Game';
import InputRound from '../components/counter/inputRound';

import { Grid, Typography, Paper } from '@material-ui/core';
import IRound from '../models/IRound';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      height: '520px',
      maxWidth: '800px',
      width: '100%',
      margin: `0 auto`,
    },
    team: {
      textAlign: 'center',
    },
    center: {
      alignSelf: 'center',
    },
    paper: {
      padding: theme.spacing(2),
    },
  });

interface Props extends WithStyles<typeof styles> {
  settings: ISettings;
  game: Game;
  updateGame: (game: Game) => void;
}

const CounterView = ({ classes, settings, game, updateGame }: Props) => {
  const teams = settings.getTeams();
  const addRound = (round: IRound) => {
    game.pushRound(round);
    updateGame(game);
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Grid container spacing={2} className={classes.team}>
          <Grid item xs={6}>
            <Typography variant="h4">{game.getTotalPoints()[0]}</Typography>
            <Typography variant="h6">Team {teams[0].name}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h4">{game.getTotalPoints()[1]}</Typography>
            <Typography variant="h6">Team {teams[1].name}</Typography>
          </Grid>
        </Grid>
      </Paper>
      <InputRound addRound={addRound} settings={settings} />
    </div>
  );
};

export default withStyles(styles)(CounterView);
