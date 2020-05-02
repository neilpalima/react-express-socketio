import React from "react";

import {
  makeStyles,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
} from "@material-ui/core";

import { Link } from 'react-router-dom';

import StarIcon from "@material-ui/icons/Star";

const useStyles = makeStyles(() => ({
  list: {
    marginTop: "1em",
    padding: "1em"
  }
}));

const rooms = [{ name: "Anime" }, { name: "NBA" }];

function Room () {
  const classes = useStyles();

  return (
    <Paper elevation={2}>
      <List component="nav" className={classes.list} aria-label="contacts">
        <Typography variant="h5" gutterBottom>
          Select Chat Room
        </Typography>
        {rooms.map(({ name }) => (
          <ListItem button key={name} component={Link} to={`/room/${name.toLowerCase()}`}>
            <ListItemIcon>
              <StarIcon />
            </ListItemIcon>
            <ListItemText primary={name} />
          </ListItem>
        ))}
      </List>
    </Paper>
  )
}

export default Room;