import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./src/routes/auth.routes.js";
import healthRouter from "./src/routes/healthCheck.routes.js";
import messageRouter from "./src/routes/message.route.js";
import cors from "cors";
import path from "node:path";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const __dirname = path.resolve();

// Global middlewares
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/healthCheck", healthRouter);
app.use("/api/v1/message", messageRouter);

if (process.env.NODE_ENV !== "development") {
  app.use(express.static(path.join(__dirname, "../Frontend/dist")));

  app.get("/(*)/", (req, res) => {
    res.sendFile(path.join(__dirname, "../Frontend", "dist", "index.html"));
  });
}
export default app;
