import express from "express";
import cors from "cors";
import winston from "winston";
import path from 'path';
import redis from "socket.io-redis";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());

const server = require("http").Server(app);
const io = require("socket.io")(server, {
  transports: ["websocket"],
});
const { PORT, REDIS_HOST, REDIS_PORT } = process.env;
const port = PORT || 8080;
// io.adapter(redis({ host: REDIS_HOST, port: REDIS_PORT }));

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "user-service" },
  transports: [new winston.transports.File({ filename: `combined.log` })],
});

io.on("connection", (socket) => {
  socket.on("join-room", socket.join);
  socket.on("leave-room", socket.leave);

  socket.on("chat", (room, message) => {
    io.to(room).emit("chat", message);
  });

});

app.use(express.static(path.join(__dirname, '../../app-ui', 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../app-ui', 'build', 'index.html'));
});

server.listen(port, () => {
  logger.info(`Server started on port ${port}`);
});
