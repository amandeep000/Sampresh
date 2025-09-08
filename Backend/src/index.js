import express from "express";
import authRoutes from "./routes/auth.routes.js";
import healthRouter from "./routes/healthCheck.routes.js";
import dotenv from "dotenv";
import { connectDB } from "./db/index.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/healthCheck", healthRouter);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
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
