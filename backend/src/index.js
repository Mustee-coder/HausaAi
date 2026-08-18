import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import jobRoutes from "./routes/job.routes.js";
import authRoutes from "./routes/auth.routes.js";
import learnRoutes from "./routes/learn.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import translateRoutes from "./routes/translate.routes.js";

const app = express();

// Allow both the deployed frontend (Vercel) and local development
// (Vite's default port) at the same time — no more manually swapping
// CLIENT_URL back and forth between local and production.
const allowedOrigins = [
  process.env.CLIENT_URL, // production, e.g. https://hausa-ai-two.vercel.app
  "http://localhost:5173", // local Vite dev server
  "http://127.0.0.1:5173",
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // requests with no origin (curl, server-to-server, mobile apps) are allowed
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn("Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // allows cookies to be sent/received
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/job", jobRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/learn", learnRoutes);
app.use("/api/translate", translateRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "HausaAI Backend is running 🚀",
  });
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });
