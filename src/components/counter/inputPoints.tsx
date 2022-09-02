import React from 'react';
import { createStyles, Theme } from '@material-ui/core';
import { WithStyles, withStyles } from '@material-ui/core/styles';

import { Slider } from '@material-ui/core';

const styles = (theme: Theme) => createStyles({});

const PrettoSlider = withStyles({
  root: {
    color: '#191b19',
    height: 10,
    width: `calc(100% - 56px)`,
  },
  thumb: {
    height: 32,
    width: 32,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    marginTop: -8,
    marginLeft: -12,
    '&:focus,&:hover,&$active': {
      boxShadow: 'inherit',
    },
  },
  active: {},
  valueLabel: {
    left: 'calc(-50% + 4px)',
  },
  track: {
    height: 16,
    borderRadius: 8,
  },
  rail: {
    height: 16,
    borderRadius: 8,
  },
})(Slider);

interface Props extends WithStyles<typeof styles> {
  points: number;
  onChange: (value: number) => void;
}

const InputPoints = ({ points, onChange }: Props) => {
  return <PrettoSlider value={points} min={-25} max={125} step={5} onChange={(e, v) => onChange(v as number)} />;
};

export default withStyles(styles)(InputPoints);
