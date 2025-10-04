import { Server } from "socket.io";
import { ApiError } from "../utils/apiError.utils.js";

let io;

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

export function getIO() {
  if (!io) {
    throw new ApiError(500, "Socket.io is not initialized yet!");
  }
  return io;
}

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId) userSocketMap[userId] = socket.id;

    // io.emit() is used to send event to all the connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
      console.log("A user disconnected", socket.id);
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  });

  return io;
};
// used to store online users
const userSocketMap = {};

export { initSocket };

// import { Server } from "socket.io";
// import http from "node:http";

// import express from "express";

// const app = express();
// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5173",
//     credentials: true,
//   },
// });

// io.on("connection", (socket) => {
//   console.log("A user connected", socket.id);

//   socket.on("disconnect", () => {
//     console.log("A user disconnected", socket.id);
//   });
// });

// export { io, app, server };
