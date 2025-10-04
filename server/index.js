import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import morgan from "morgan";
import quizRoutes from "./routes/quizRoutes.js";
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

// Middleware
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB Connection
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://";

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("✅ Connected to Resumentor DB");
  })
  .catch((err) => {
    console.error("❌ Error connecting to DB:", err);
  });

// Routes
app.get("/", (req, res) => {
  res.json("Welcome to Resumentor");
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Resumentor API is running",
    timestamp: new Date(),
  });
});

app.use("/api/quiz", quizRoutes);

// Global error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🔗 http://localhost:${PORT}`);
});
