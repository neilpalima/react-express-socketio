import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import { Link, withRouter } from 'react-router-dom';

import {
  makeStyles,
  Typography,
  Button,
  TextField,
  Paper
} from "@material-ui/core";

const endpoint = `http://localhost:${process.env.PORT || 8080}`;
const initialMessage = [{ name: "Admin", message: "Welcome to the chatroom!" }];

const useStyles = makeStyles(theme => ({
  list: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
    margin: "1em 0em",
    padding: "1em 0em"
  },
  button: {
    marginTop: theme.spacing(1)
  },
  margin: {
    margin: "1em"
  },
  message: {
    height: "43vh",
    overflow: "auto"
  },
  paper: {
    padding: theme.spacing(1),
    marginTop: theme.spacing(1),
  }
}));

function Chatroom ({ location }) {
  const classes = useStyles();

  const [messages, setMessages] = useState(initialMessage);
  const [chatMessage, setChatMessage] = useState({
    name: "",
    message: "",
    submitted: false
  });
  const [io, setIO] = useState({});
  const [room] = useState(location.pathname.split('/')[2]);

  useEffect(() => {
    const socket = socketIOClient(endpoint, { transports: ["websocket"] });

    setIO(socket);
    socket.on("chat", handleUpdateMessages);
    socket.emit("join-room", room);

    // reconnection
    socket.on("connect", () => {
      socket.emit("join-room", room);
    });

    return () => {
      socket.emit("leave-room", room);
      socket.removeListener("connect");
    }
  }, [room]);

  const handleUpdateMessages = data => {
    setMessages(prevState => [...prevState, data]);
  };

  const handleChangeChatMessage = key => e => {
    setChatMessage({ ...chatMessage, [key]: e.target.value });
  };

  const handleKeyUp = (code, fn) => e => {
    if (e.keyCode === code) {
      fn();
    }
  };

  const handleSendMessage = () => {
    if (!chatMessage.submitted) {
      setChatMessage({
        ...chatMessage,
        submitted: true
      });
    }

    if (chatMessage.message !== "" && chatMessage.name !== "") {
      io.emit("chat", room, chatMessage);
      setChatMessage({ ...chatMessage, message: "" });
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color="secondary"
        className={classes.button}
        component={Link}
        to="/"
      >
        Leave {room} Room
      </Button>
      <Paper className={classes.paper} elevation={2}>
        <div className={classes.margin}>
          <Typography variant="body1" gutterBottom className={classes.message}>
            {messages.map((data, i) => (
              <React.Fragment key={`message-${i}`}>
                <strong>{data.name}</strong>: {data.message} {'\n'}
                <br />
              </React.Fragment>
            ))}
          </Typography>
        </div>
      </Paper>
      <Paper className={classes.paper} elevation={2}>
        <div className={classes.margin}>
          <TextField
            label="Your Name"
            fullWidth
            value={chatMessage.name}
            onChange={handleChangeChatMessage("name")}
            error={chatMessage.submitted && chatMessage.name === ""}
          />
        </div>
        <div className={classes.margin}>
          <TextField
            label="Message"
            placeholder="Message"
            fullWidth
            value={chatMessage.message}
            onChange={handleChangeChatMessage("message")}
            onKeyUp={handleKeyUp(13, handleSendMessage)}
            error={chatMessage.submitted && chatMessage.message === ""}
          />
        </div>
        <div className={classes.margin}>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={handleSendMessage}
          >
            Send
          </Button>
        </div>
      </Paper>
    </>
  )
}

export default withRouter(Chatroom);