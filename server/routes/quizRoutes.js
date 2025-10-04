import express from "express";

import { startQuiz, submitQuiz } from "../controllers/quizController.js";

const router = express.Router();

// Route to start a quiz based on resume and difficulty
router.post("/start", startQuiz);

// Route to submit quiz answers and get results
router.post("/submit", submitQuiz);

export default router;
