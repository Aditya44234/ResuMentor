import mongoose from "mongoose";

const quizSessionSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, unique: true },
    resumeText: { type: String, required: true },
    difficulty: {
      type: String,
      required: true,
      enum: ["easy", "medium", "hard"],
    },
    questions: [
      {
        question: {
          type: String,
          required: true,
        },
        options: {
          type: [String],
          required: true,
          validate: {
            validator: function (arr) {
              return arr.length === 4;
            },
            message: "Options must contain exactly 4 items",
          },
        },

        correctAnswer: { type: Number, required: true, min: 0, max: 3 },
        explanation: { type: String, required: true },
        skill: { type: String, required: true },
      },
    ],

    createdAt: { type: Date, default: Date.now },
    expiresAt: {
      type: Date,
      required: true,
      default: function () {
        return new Date(Date.now() + 30 * 60 * 1000); // 30 minutes from creation
      },
    },
  },
  {
    timestamps: true,
  }
);

quizSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const QuizSession = mongoose.model("QuizSession", quizSessionSchema);
export default QuizSession;
