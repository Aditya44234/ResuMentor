import React, { useState } from "react";
import ResumeUpload from "./components/ResumeUpload";
import Quiz from "./pages/Quiz";
import QuizReport from "./pages/QuizReport"

export default function App() {
  const [quizData, setQuizData] = useState(null);

  const handleQuizStart = ({ quiz, sessionId }) => {
    setQuizData({ quiz, sessionId });
  };

  const handleQuizFinish = (result) => {
    console.log("Quiz finished:", result);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {!quizData ? (
        <ResumeUpload onQuizStart={handleQuizStart} />
      ) : (
        <Quiz
          quiz={quizData.quiz}
          sessionId={quizData.sessionId}
          userId={quizData.userId} // Make sure to pass userId if available
          QuizReportComponent={QuizReport}
          onFinish={handleQuizFinish}
        />
      )}
    </div>
  );
}