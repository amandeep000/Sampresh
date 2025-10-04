import dotenv from "dotenv";
import { connectDB } from "./db/index.js";
import app from "../app.js";
import { initSocket } from "./lib/socket.js";
import http from "node:http";

dotenv.config();
const PORT = process.env.PORT;

const startServer = async () => {
  try {
    await connectDB();
    const server = http.createServer(app);
    initSocket(server);
    server.listen(PORT, () => {
      console.log("Server is now listening on port: ", PORT);
    });
  } catch (error) {
    console.error("Failed to connect to mongodb", {
      message: error.message,
      stack: error.stack,
    });
    process.exit(1);
  }
};
startServer();
