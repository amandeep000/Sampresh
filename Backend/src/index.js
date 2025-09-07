import express from "express";
import authRoutes from "./routes/auth.routes.js";

const app = express();
const PORT = 5001;

app.use("/api/v1/auth", authRoutes);

app.listen(PORT, () => {
  console.log("Server is now listening on port: ", PORT);
});
