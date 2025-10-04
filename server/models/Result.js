import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      ref: "QuizSession",
    },

    userAnswers: {
      type: [Number],
      required: true,
      validate: {
        validator: function (arr) {
          return arr.length === 5;
        },
        message: "userAnswers must be an array of exactly 5 numbers",
      },
    },

    score: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
    },

    totalQuestions: {
      type: Number,
      required: true,
      default: 5,
    },

    detailedResults: [
      {
        questionIndex: { type: Number, required: true },
        question: { type: String, required: true },
        isCorrect: { type: Boolean, required: true },
        userAnswer: { type: Number, required: true },
        correctAnswer: { type: Number, required: true, min: 0, max: 3 },
        explanation: { type: String, required: true },

        skill: {
          type: String,
          required: true,
        },
        options: {
          type: [String],
          required: true,
        },
      },
    ],

    completedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

resultSchema.index({ sessionId: 1 });

const Result = mongoose.model("Result", resultSchema);
export default Result;
