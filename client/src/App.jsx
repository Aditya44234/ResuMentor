import React, { useState } from "react";
import ResumeUpload from "./components/ResumeUpload";
import Quiz from "./pages/Quiz";

export default function App() {
  const [quizData, setQuizData] = useState(null);

  const handleQuizStart = ({ quiz, sessionId }) => {
    setQuizData({ quiz, sessionId });
  };

  const handleQuizFinish = (result) => {
    console.log("Quiz finished:", result);
    // You can route to Result.jsx or show score here
  };

  return (
    <div className="min-h-screen bg-gray-50 ">
      {!quizData ? (
        <ResumeUpload onQuizStart={handleQuizStart} />
      ) : (
        <Quiz
          quiz={quizData.quiz}
          sessionId={quizData.sessionId}
          onFinish={handleQuizFinish}
        />
      )}
    </div>
  );
}
