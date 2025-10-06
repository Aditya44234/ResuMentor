import { useEffect, useState } from "react";

// Mock API function - replace with your actual API call
const submitQuiz = async (sessionId, userId, submittedAnswers) => {
  const response = await fetch("https://resumentor-server.onrender.com/api/quiz/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sessionId, userId, submittedAnswers }),
  });

  if (!response.ok) {
    throw new Error("Failed to submit quiz");
  }

  return await response.json();
};

const Quiz = ({ quiz, sessionId, userId, onFinish, QuizReportComponent }) => {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState(null);

  // Initialize answers array with empty strings
  useEffect(() => {
    if (quiz && quiz.length > 0 && answers.length === 0) {
      setAnswers(new Array(quiz.length).fill(""));
      console.log(
        "📋 Initialized answers array with",
        quiz.length,
        "empty slots"
      );
    }
  }, [quiz, answers.length]);

  const current = quiz[index];
  const selectedOption = answers[index] || "";

  useEffect(() => {
    console.log("=== STATE DEBUG ===");
    console.log("Current index:", index);
    console.log("All answers array:", answers);
    console.log("Selected option for current question:", selectedOption);
    console.log(
      "Total answered questions:",
      answers.filter((a) => a !== "").length
    );
    console.log("==================");
  }, [answers, index, selectedOption]);

  const handleSelect = (option) => {
    console.log("=== SELECTING ANSWER ===");
    console.log("Question index:", index);
    console.log("Selected option:", option);

    setAnswers((prev) => {
      const updated = [...prev];
      updated[index] = option;
      console.log("After update - answers:", updated);
      return updated;
    });
  };

  const handleNext = async () => {
    if (!selectedOption || selectedOption === "") {
      alert("Please select an answer before proceeding.");
      return;
    }

    if (index < quiz.length - 1) {
      setIndex(index + 1);
    } else {
      const unansweredCount = answers.filter((a) => a === "").length;
      if (unansweredCount > 0) {
        alert(
          `Please answer all questions. ${unansweredCount} question(s) remaining.`
        );
        return;
      }

      try {
        setIsSubmitting(true);

        console.log("=== SUBMITTING QUIZ ===");
        console.log("Answers array:", answers);

        const result = await submitQuiz(sessionId, userId, answers);

        console.log("=== RESULT RECEIVED ===");
        console.log("Result:", result);

        setScore(result.result.score);
        setQuizResult(result.result);
        setShowScore(true);

        if (onFinish) {
          onFinish(result);
        }
      } catch (error) {
        console.error("=== ERROR SUBMITTING QUIZ ===");
        console.error("Error:", error);
        alert(`Failed to submit quiz: ${error.message}`);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handlePrevious = () => {
    if (index > 0) {
      setIndex(index - 1);
    }
  };

  const handleViewReport = () => {
    setShowReport(true);
  };

  const handleBackToScore = () => {
    setShowReport(false);
  };

  const handleRetake = () => {
    window.location.reload();
  };

  const progressPercentage = ((index + 1) / quiz.length) * 100;
  const answeredCount = answers.filter((a) => a !== "").length;
  const allQuestionsAnswered = answers.every((a) => a !== "");

  if (answers.length === 0) {
    return (
      <div className="h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading quiz...</div>
      </div>
    );
  }

  // Show detailed report if QuizReportComponent is provided
  if (showReport && quizResult && QuizReportComponent) {
    return (
      <QuizReportComponent
        result={quizResult}
        quiz={quiz}
        onRetake={handleRetake}
        onBackToScore={handleBackToScore}
      />
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 flex items-center justify-center px-4 py-8 relative overflow-hidden">
     

      <div className="max-w-5xl w-full h-full relative z-10 flex flex-col overflow-hidden">
        {!showScore ? (
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden flex-1 flex flex-col max-h-full">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 sm:px-8 py-6">
              <div className="flex  sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
                <h1 className="text-xl sm:text-xl font-bold text-white">
                  Quiz Challenge
                </h1>
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 flex flex-col  rounded-full text-sm font-semibold text-white  items-center gap-2 w-fit">
                  <span>
                    {answeredCount} / {quiz.length}
                  </span>
                </div>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-green-400 to-emerald-400 h-3 rounded-full transition-all duration-500 shadow-lg"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>

            <div className="p-4 sm:p-8 overflow-y-auto flex-1">
              <div className="mb-4">
                <h2 className="text-xl sm:text-xl font-bold text-gray-800 mb-4 leading-relaxed">
                  {current.question}
                </h2>
                <div className="space-y-3">
                  {current.options.map((option, i) => {
                    const isSelected = selectedOption === option;
                    return (
                      <button
                        key={i}
                        onClick={() => handleSelect(option)}
                        className={`w-full text-left px-5 sm:px-6 py-3 rounded-xl border-2 transition-all duration-200 ${
                          isSelected
                            ? "border-indigo-500 bg-indigo-50 shadow-lg transform scale-[1.02]"
                            : "border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50 hover:shadow-md"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-medium text-gray-800 text-sm sm:text-[14px]">
                            {option}
                          </span>
                          {isSelected && (
                            <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <svg
                                className="w-4 h-4 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-3 sm:gap-4 mt-8">
                <button
                  onClick={handlePrevious}
                  disabled={index === 0}
                  className={`flex-1 py-3 sm:py-4 rounded-xl font-semibold transition-all duration-200 text-sm sm:text-base ${
                    index > 0
                      ? "bg-gray-100 hover:bg-gray-200 text-gray-700 hover:shadow-md transform hover:scale-[1.02]"
                      : "bg-gray-100 text-gray-300 cursor-not-allowed"
                  }`}
                >
                  ← Previous
                </button>
                <button
                  onClick={handleNext}
                  disabled={
                    !selectedOption || selectedOption === "" || isSubmitting
                  }
                  className={`flex-1 py-3 sm:py-4 rounded-xl font-semibold transition-all duration-200 text-sm sm:text-base ${
                    selectedOption && selectedOption !== "" && !isSubmitting
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                      : "bg-gray-100 text-gray-300 cursor-not-allowed"
                  }`}
                >
                  {isSubmitting
                    ? "Submitting..."
                    : index === quiz.length - 1
                    ? allQuestionsAnswered
                      ? "Submit Quiz →"
                      : `Submit (${answeredCount}/${quiz.length}) →`
                    : "Next →"}
                </button>
              </div>
            </div>

            <div className="bg-gray-50 px-6 sm:px-8 py-4 border-t border-gray-200">
              <p className="text-xs text-gray-600 text-center">
                💡 Take your time and think carefully before selecting an answer
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden flex-1 flex flex-col max-h-full">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 sm:px-8 py-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
                <svg
                  className="w-7 h-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Quiz Complete!
              </h2>
              <p className="text-indigo-100 mt-1">Here's how you performed</p>
            </div>

            <div className="p-6 sm:p-12 overflow-y-auto flex-1 flex items-center justify-center">
              <div className="text-center space-y-6 w-full">
                <div className="flex justify-center">
                  <div
                    className={`rounded-full p-6 ${
                      score === quiz.length
                        ? "bg-green-100"
                        : score >= quiz.length / 2
                        ? "bg-indigo-100"
                        : "bg-orange-100"
                    }`}
                  >
                    <svg
                      className={`w-16 h-16 ${
                        score === quiz.length
                          ? "text-green-600"
                          : score >= quiz.length / 2
                          ? "text-indigo-600"
                          : "text-orange-600"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                      />
                    </svg>
                  </div>
                </div>

                <div>
                  <h2 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-2">
                    {score} / {quiz.length}
                  </h2>
                  <p className="text-gray-500 text-base sm:text-lg">
                    Questions Correct
                  </p>
                </div>

                <div className="py-4">
                  <div className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {Math.round((score / quiz.length) * 100)}%
                  </div>
                </div>

                <p
                  className={`text-lg sm:text-xl font-semibold px-4 ${
                    score === quiz.length
                      ? "text-green-600"
                      : score >= quiz.length / 2
                      ? "text-indigo-600"
                      : "text-orange-600"
                  }`}
                >
                  {score === quiz.length
                    ? "🎉 Perfect Score! Outstanding work!"
                    : score >= quiz.length / 2
                    ? "✨ Great job! You passed the quiz!"
                    : "💪 Keep practicing! You'll do better next time!"}
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 pt-4">
                  <button
                    onClick={handleRetake}
                    className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center gap-2"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Retake Quiz
                  </button>
                  <button
                    onClick={handleViewReport}
                    className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center gap-2"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Detailed Report
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-6 sm:px-8 py-4 border-t border-gray-200">
              <p className="text-xs text-gray-600 text-center">
                📊 Review your answers to learn from mistakes and improve
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
