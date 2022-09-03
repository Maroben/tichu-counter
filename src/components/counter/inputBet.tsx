import React, { useState } from 'react';
import { createStyles, Theme } from '@material-ui/core';
import { WithStyles, withStyles } from '@material-ui/core/styles';

import IBet, { BetType } from '../../models/IBet';

import { Popover, ButtonGroup, Button, Paper, Grid } from '@material-ui/core';
import CloseSharpIcon from '@material-ui/icons/CloseSharp';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(2),
    },
    w100: {
      width: '100%',
    },
    vw100: {
      width: `calc(50vw - ${theme.spacing(3)}px)`,
    },
  });

interface Props extends WithStyles<typeof styles> {
  label: string;
  bet: IBet;
  cantWin: boolean;
  nrBets: number[];
  onBet: (bet: IBet) => void;
  onRemove: () => void;
}

const InputBet = ({ classes, label, bet, nrBets, cantWin, onBet, onRemove }: Props) => {
  const [anchorEl, setAnchorEl] = useState(null as unknown);
  const [selected, setSelected] = useState([false, false, false]);
  const open = Boolean(anchorEl);

  const openPopover = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (bet.bet === BetType.none) {
      bet = {
        bet: BetType.small,
        success: cantWin || nrBets[0] >= 1 ? false : true,
      };
      handleClick(bet);
    }
    setAnchorEl(e.currentTarget.parentElement);
  };

  const changeBetType = (b: BetType) => {
    bet.bet = b;
    handleClick(bet);
  };

  const changeSuccess = (s: boolean) => {
    bet.success = s;
    handleClick(bet);
  };

  const handleClick = (b: IBet) => {
    selected[0] = b.bet == BetType.small;
    selected[1] = b.bet == BetType.big;
    selected[2] = b.success;
    setSelected(selected);
    onBet(b);
  };

  return (
    <>
      {bet.bet === BetType.none ? (
        <Button color="default" variant="outlined" className={classes.w100} onClick={openPopover}>
          {label}
        </Button>
      ) : (
        <ButtonGroup variant="contained" className={classes.w100} color={bet.success ? 'primary' : 'secondary'}>
          <Button onClick={onRemove}>
            <CloseSharpIcon />
          </Button>
          <Button onClick={openPopover} className={classes.w100}>
            {BetType[bet.bet]} {bet.success ? 'win' : 'fail'}
          </Button>
        </ButtonGroup>
      )}
      {bet && (
        <Popover
          open={open}
          anchorEl={anchorEl as Element}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{
            vertical: 'center',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'center',
            horizontal: 'center',
          }}>
          <Paper className={classes.vw100}>
            <Grid container>
              <Grid item xs={6}>
                <Button
                  variant={selected[0] ? 'contained' : 'text'}
                  color={selected[0] ? 'primary' : 'default'}
                  className={classes.w100}
                  onClick={() => changeBetType(BetType.small)}>
                  Small
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant={selected[1] ? 'contained' : 'text'}
                  color={selected[1] ? 'primary' : 'default'}
                  className={classes.w100}
                  onClick={() => changeBetType(BetType.big)}>
                  Big
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant={selected[2] ? 'contained' : 'text'}
                  color={selected[2] ? 'primary' : 'default'}
                  className={classes.w100}
                  onClick={() => changeSuccess(true)}
                  disabled={cantWin || (!bet.success && nrBets[0] === 1)}>
                  Success
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant={!selected[2] ? 'contained' : 'text'}
                  color={!selected[2] ? 'secondary' : 'default'}
                  className={classes.w100}
                  onClick={() => changeSuccess(false)}
                  disabled={bet.success && nrBets[1] === 3}>
                  Failure
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Popover>
      )}
    </>
  );
};

export default withStyles(styles)(InputBet);
