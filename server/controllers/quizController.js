import mongoose from "mongoose";
import QuizSession from "../models/QuizSession.js";
import Result from "../models/Result.js";
import {
  generateQuizQuestions,
  validateResume,
} from "../utils/geminiPrompt.js";

export const startQuiz = async (req, res) => {
  try {
    const { resumeText, difficulty = "medium", userId } = req.body;

    if (!resumeText || resumeText.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "Resume text is required",
      });
    }

    // Step 1: Validate resume
    const validation = await validateResume(resumeText);
    if (!validation.isResume) {
      return res.status(400).json({
        success: false,
        error: validation.message || "The provided text is not a valid resume.",
      });
    }

    // Step 2: Generate quiz questions
    const questions = await generateQuizQuestions(resumeText, difficulty);

    // Step 3: Save quiz session
    const quizSession = new QuizSession({
      sessionId: new mongoose.Types.ObjectId().toString(),
      userId,
      resumeText,
      questions,
      difficulty,
    });


    await quizSession.save();

    res.status(200).json({
      success: true,
      message: "Quiz generated successfully",
      sessionId: quizSession._id,
      quiz: questions,
    });
  } catch (error) {
    console.error("❌ Error in startQuiz:", error.message || error);
    res.status(500).json({
      success: false,
      error: "Failed to generate quiz",
    });
  }
};

export const submitQuiz = async (req, res) => {
  try {
    const { sessionId, userId, submittedAnswers } = req.body;

    // Detailed logging for debugging
    console.log("📥 ===== SUBMIT QUIZ REQUEST =====");
    console.log("Session ID:", sessionId);
    console.log("User ID:", userId);
    console.log("Submitted Answers:", submittedAnswers);
    console.log("==================================");

    // Validation: Check if submittedAnswers exists and is an array
    if (!submittedAnswers || !Array.isArray(submittedAnswers)) {
      console.error("❌ Invalid submittedAnswers format");
      return res.status(400).json({
        success: false,
        error: "Submitted answers must be an array",
      });
    }

    // Validation: Check sessionId
    if (!sessionId) {
      console.error("❌ Session ID is missing");
      return res.status(400).json({
        success: false,
        error: "Session ID is required",
      });
    }

    // Find quiz session
    console.log("🔍 Searching for quiz session...");
    const quizSession = await QuizSession.findById(sessionId);

    if (!quizSession) {
      console.error("❌ Quiz session not found for ID:", sessionId);
      return res.status(404).json({
        success: false,
        error: "Quiz session not found",
      });
    }

    console.log("✅ Quiz Session found!");
    console.log("Questions count:", quizSession.questions.length);
    console.log("Submitted answers count:", submittedAnswers.length);

    // Validation: Check if answer count matches question count (should be 5)
    if (submittedAnswers.length !== 5) {
      console.error("❌ Answer count mismatch");
      return res.status(400).json({
        success: false,
        error: `Expected 5 answers, but got ${submittedAnswers.length}`,
      });
    }

    const userAnswers = [];
    const detailedResults = [];
    let score = 0;

    // Process each question and answer
    quizSession.questions.forEach((question, index) => {
      const selectedOption = submittedAnswers[index]; // This is the option text like "React"
      const correctAnswer = question.correctAnswer; // This should be a number (0-3)

      // Find the index of the selected option
      let userAnswerIndex = -1;
      if (selectedOption && selectedOption !== "") {
        userAnswerIndex = question.options.findIndex(
          (opt) => opt === selectedOption
        );
      }

      // If user didn't answer or answer not found, default to -1 or 0
      if (userAnswerIndex === -1) {
        userAnswerIndex = 0; // Default to first option if not found
      }

      const isCorrect = userAnswerIndex === correctAnswer;

      console.log(`\n📝 Question ${index + 1}:`);
      console.log("  Selected option text:", selectedOption);
      console.log("  Selected option index:", userAnswerIndex);
      console.log("  Correct answer index:", correctAnswer);
      console.log("  Match:", isCorrect);

      if (isCorrect) score++;

      // Store as number for userAnswers array
      userAnswers.push(userAnswerIndex);

      // Store detailed result
      detailedResults.push({
        questionIndex: index,
        question: question.question,
        isCorrect,
        userAnswer: userAnswerIndex,
        correctAnswer: correctAnswer,
        explanation: question.explanation || "No explanation provided",
        skill: question.skill || "General",
        options: question.options,
      });
    });

    const totalQuestions = 5;

    console.log("\n📊 Final Results:");
    console.log("User Answers (indices):", userAnswers);
    console.log("Score:", score);
    console.log("Total:", totalQuestions);

    // Save result to database with correct schema
    const result = new Result({
      sessionId,
      userAnswers, // Array of numbers [0-3]
      score,
      totalQuestions,
      detailedResults,
    });

    await result.save();
    console.log("✅ Result saved to database");

    res.status(200).json({
      success: true,
      message: "Quiz submitted successfully",
      result: {
        score,
        totalQuestions,
        percentage: Math.round((score / totalQuestions) * 100),
        detailedResults,
      },
    });

    console.log("✅ ===== SUBMIT QUIZ COMPLETED =====\n");
  } catch (error) {
    console.error("❌ ===== ERROR IN SUBMIT QUIZ =====");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    console.error("====================================\n");

    res.status(500).json({
      success: false,
      error: "Internal server error",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};