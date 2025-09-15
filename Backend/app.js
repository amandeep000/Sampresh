import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./src/routes/auth.routes.js";
import healthRouter from "./src/routes/healthCheck.routes.js";
import messageRouter from "./src/routes/message.route.js";

const app = express();
// Global middlewares
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/healthCheck", healthRouter);
app.use("/api/v1/message");

export default app;
