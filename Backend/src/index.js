import dotenv from "dotenv";
import { connectDB } from "./db/index.js";
import { server } from "./lib/socket.js";

dotenv.config();
const PORT = process.env.PORT;

const startServer = async () => {
  try {
    await connectDB();
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
