import express from "express";
import type { Request, Response } from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config";

import authRoutes from "./routes/auth.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import jobRoutes from "./routes/job.routes.js";
import learnRoutes from "./routes/learn.routes.js";
import translateRoutes from "./routes/translate.routes.js";

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/job", jobRoutes);
app.use("/api/learn", learnRoutes);
app.use("/api/translate", translateRoutes);

// Environment
const PORT = process.env.PORT || 5000;

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  throw new Error("MONGO_URI is not defined");
}

// Home route
app.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "HausaAI Backend is running 🚀",
  });
});

// MongoDB connection
mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("MongoDB Connected");

    app.listen(PORT, () => {
      console.log(
        `Server running on port ${PORT}`
      );
    });
  })
  .catch((error: unknown) => {
    if (error instanceof Error) {
      console.error(
        "MongoDB connection failed:",
        error.message
      );
    } else {
      console.error(
        "MongoDB connection failed:",
        error
      );
    }
  });