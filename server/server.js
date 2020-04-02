import express from "express";
import cors from "cors";

const app = express();

app.use(cors());

const server = require("http").Server(app);
const io = require("socket.io")(server);
const port = process.env.PORT || 8080;

// io.set('transports', ['websocket']);

io.on("connection", socket => {
  socket.on("join-room", data => {
    socket.join(data);
  });
  socket.on("leave-room", socket.leave);

  socket.on("chat", (room, message) => {
    io.to(room).emit("chat", message);
  });
});

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
