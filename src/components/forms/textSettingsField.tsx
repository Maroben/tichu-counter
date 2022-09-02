import React, { useState } from 'react';
import { createStyles, Theme } from '@material-ui/core';
import { WithStyles, withStyles } from '@material-ui/core/styles';

import {
  TextField,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@material-ui/core';

import LinkIcon from '@material-ui/icons/LinkSharp';
import EditIcon from '@material-ui/icons/EditSharp';
import ClearIcon from '@material-ui/icons/ClearSharp';
import CheckIcon from '@material-ui/icons/CheckSharp';

const styles = (theme: Theme) =>
  createStyles({
    listItem: {
      height: theme.spacing(8),
    },
  });

interface Props extends WithStyles<typeof styles> {
  previous: string;
  onSubmit: (field: string) => void;
  listIcon: '*.png';
  linkable?: boolean;
}

const TextSettingsField = ({ classes: c, previous, onSubmit, listIcon, linkable = false }: Props) => {
  const [field, setField] = useState(previous);
  const [edit, setEdit] = useState(false);

  const onClear = () => {
    setField(previous);
    setEdit(false);
  };

  const handleSubmit = () => {
    onSubmit(field);
    setEdit(false);
  };

  return (
    <ListItem className={c.listItem}>
      <ListItemIcon>
        <img src={listIcon} height={45} />
      </ListItemIcon>
      {edit ? (
        <>
          <TextField value={field} onChange={({ target }) => setField(target.value)} />
          <ListItemSecondaryAction>
            <IconButton color="secondary" onClick={onClear}>
              <ClearIcon />
            </IconButton>
            <IconButton edge="end" color="primary" onClick={handleSubmit}>
              <CheckIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </>
      ) : (
        <>
          <ListItemText primary={field} />
          <ListItemSecondaryAction>
            {linkable && (
              <IconButton disabled>
                <LinkIcon />
              </IconButton>
            )}
            <IconButton edge="end" onClick={() => setEdit(true)}>
              <EditIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </>
      )}
    </ListItem>
  );
};

export default withStyles(styles)(TextSettingsField);
