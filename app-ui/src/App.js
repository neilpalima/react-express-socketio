import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";

import {
  makeStyles,
  CssBaseline,
  Typography,
  Container,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  TextField
} from "@material-ui/core";

import StarIcon from "@material-ui/icons/Star";

const endpoint = "http://localhost:8080";
const rooms = [{ name: "Anime" }, { name: "NBA" }];
const initialMessage = [{ name: "Admin", message: "Welcome to the chatroom!" }];

const useStyles = makeStyles(theme => ({
  list: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
    margin: "1em",
    padding: "1em"
  },
  button: {
    margin: theme.spacing(1)
  },
  margin: {
    margin: "1em"
  },
  indent: {
    margin: "1em",
    padding: "1em"
  },
  message: {
    height: "500px",
    overflow: "auto"
  }
}));

function App() {
  const classes = useStyles();

  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    const io = socketIOClient(endpoint);
    setIo(io);

    io.on("chat", handleUpdateMessages);
  }, []);

  const [io, setIo] = useState(null);
  const [messages, setMessages] = useState(initialMessage);
  const [chatMessage, setChatMessage] = useState({ name: "", message: "" });

  const handleSelectRoom = name => {
    setSelectedRoom(name);
    io.emit("join-room", name);

    // reconnection
    io.on("connect", () => {
      io.emit("join-room", name);
    });
  };

  const handleLeaveRoom = () => {
    setSelectedRoom(null);
    setMessages(initialMessage);
    setChatMessage({ name: "", message: "" });
    io.emit("leave-room", selectedRoom);
    io.removeListener("connect");
  };

  const handleChangeChatMessage = key => e => {
    setChatMessage({ ...chatMessage, [key]: e.target.value });
  };

  const handleSendMessage = () => {
    if (chatMessage.message !== "") {
      io.emit("chat", selectedRoom, chatMessage);
      setChatMessage({ ...chatMessage, message: "" });
    }
  };

  const handleKeyUp = (code, fn) => e => {
    if (e.keyCode === code) {
      fn();
    }
  };

  const handleUpdateMessages = data => {
    setMessages(prevState => [...prevState, data]);
  };

  const renderRooms = () => (
    <List component="nav" className={classes.list} aria-label="contacts">
      <Typography variant="h5" gutterBottom>
        Select Chat Room
      </Typography>
      {rooms.map(({ name }) => (
        <ListItem button key={name} onClick={() => handleSelectRoom(name)}>
          <ListItemIcon>
            <StarIcon />
          </ListItemIcon>
          <ListItemText primary={name} />
        </ListItem>
      ))}
    </List>
  );

  const renderChatRoom = () => (
    <>
      <div className={classes.list}>
        <Button
          variant="contained"
          color="secondary"
          className={classes.button}
          onClick={handleLeaveRoom}
        >
          Leave {selectedRoom} Room
        </Button>
        <div className={classes.margin}>
          <Typography variant="body1" gutterBottom className={classes.message}>
            {messages.map((data, i) => (
              <React.Fragment key={`message-${i}`}>
                <strong>{data.name}</strong>: {data.message}
                <br />
              </React.Fragment>
            ))}
          </Typography>
        </div>
      </div>
      <div className={classes.list}>
        <div className={classes.margin}>
          <TextField
            label="Your Name"
            fullWidth
            value={chatMessage.name}
            onChange={handleChangeChatMessage("name")}
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
      </div>
    </>
  );

  return (
    <>
      <CssBaseline />
      <Container maxWidth="sm">
        {selectedRoom && renderChatRoom()}
        {!selectedRoom && renderRooms()}
      </Container>
    </>
  );
}

export default App;
