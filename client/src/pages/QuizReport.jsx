import { useState } from "react";

const QuizReport = ({ result, quiz, onRetake, onBackToScore }) => {
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  const { score, totalQuestions, percentage, detailedResults } = result;

  const toggleQuestion = (index) => {
    setExpandedQuestion(expandedQuestion === index ? null : index);
  };

  const getResultColor = (isCorrect) => {
    return isCorrect ? "text-green-600" : "text-red-600";
  };

  const getResultBg = (isCorrect) => {
    return isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200";
  };

  const getResultIcon = (isCorrect) => {
    if (isCorrect) {
      return (
        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    }
    return (
      <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  };

  const correctAnswersCount = detailedResults.filter(r => r.isCorrect).length;
  const incorrectAnswersCount = totalQuestions - correctAnswersCount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 px-4 py-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header Card */}
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 sm:px-8 py-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Detailed Quiz Report
            </h1>
            <p className="text-indigo-100 mt-1">Review your performance and learn from explanations</p>
          </div>

          {/* Summary Stats */}
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-indigo-600">{score}</div>
                <div className="text-sm text-gray-600 mt-1">Score</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-purple-600">{percentage}%</div>
                <div className="text-sm text-gray-600 mt-1">Percentage</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-green-600">{correctAnswersCount}</div>
                <div className="text-sm text-gray-600 mt-1">Correct</div>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-red-600">{incorrectAnswersCount}</div>
                <div className="text-sm text-gray-600 mt-1">Incorrect</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onBackToScore}
                className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Score
              </button>
              <button
                onClick={onRetake}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Retake Quiz
              </button>
            </div>
          </div>
        </div>

        {/* Questions Review */}
        <div className="space-y-4">
          {detailedResults.map((detail, index) => {
            const isExpanded = expandedQuestion === index;
            const userAnswerText = detail.options[detail.userAnswer];
            const correctAnswerText = detail.options[detail.correctAnswer];

            return (
              <div
                key={index}
                className={`bg-white/95 backdrop-blur-lg rounded-2xl shadow-lg overflow-hidden border-2 transition-all duration-200 ${
                  getResultBg(detail.isCorrect)
                }`}
              >
                {/* Question Header */}
                <button
                  onClick={() => toggleQuestion(index)}
                  className="w-full px-6 py-5 flex items-start gap-4 hover:bg-white/50 transition-colors"
                >
                  <div className="flex-shrink-0 mt-1">
                    {getResultIcon(detail.isCorrect)}
                  </div>
                  
                  <div className="flex-1 text-left">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="text-lg font-bold text-gray-800">
                        Question {index + 1}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        detail.isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {detail.isCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                    </div>
                    
                    <p className="text-gray-700 font-medium mb-3">{detail.question}</p>
                    
                    {detail.skill && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        {detail.skill}
                      </span>
                    )}
                  </div>

                  <div className="flex-shrink-0">
                    <svg
                      className={`w-6 h-6 text-gray-400 transition-transform ${
                        isExpanded ? 'transform rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-6 pb-6 border-t border-gray-200 bg-white/30">
                    <div className="pt-4 space-y-4">
                      {/* Your Answer */}
                      <div>
                        <div className="text-sm font-semibold text-gray-600 mb-2">Your Answer:</div>
                        <div className={`p-4 rounded-xl border-2 ${
                          detail.isCorrect 
                            ? 'bg-green-50 border-green-300' 
                            : 'bg-red-50 border-red-300'
                        }`}>
                          <div className="flex items-center gap-2">
                            {detail.isCorrect ? (
                              <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            )}
                            <span className={`font-medium ${getResultColor(detail.isCorrect)}`}>
                              {userAnswerText}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Correct Answer (only show if wrong) */}
                      {!detail.isCorrect && (
                        <div>
                          <div className="text-sm font-semibold text-gray-600 mb-2">Correct Answer:</div>
                          <div className="p-4 rounded-xl border-2 bg-green-50 border-green-300">
                            <div className="flex items-center gap-2">
                              <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                              <span className="font-medium text-green-700">
                                {correctAnswerText}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* All Options */}
                      <div>
                        <div className="text-sm font-semibold text-gray-600 mb-2">All Options:</div>
                        <div className="space-y-2">
                          {detail.options.map((option, optIndex) => {
                            const isUserAnswer = optIndex === detail.userAnswer;
                            const isCorrectAnswer = optIndex === detail.correctAnswer;
                            
                            return (
                              <div
                                key={optIndex}
                                className={`p-3 rounded-lg border ${
                                  isCorrectAnswer
                                    ? 'bg-green-50 border-green-200'
                                    : isUserAnswer
                                    ? 'bg-red-50 border-red-200'
                                    : 'bg-gray-50 border-gray-200'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-sm text-gray-500">{String.fromCharCode(65 + optIndex)}.</span>
                                  <span className="text-sm text-gray-700">{option}</span>
                                  {isCorrectAnswer && (
                                    <span className="ml-auto text-xs font-semibold text-green-600">✓ Correct</span>
                                  )}
                                  {isUserAnswer && !isCorrectAnswer && (
                                    <span className="ml-auto text-xs font-semibold text-red-600">Your choice</span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Explanation */}
                      {detail.explanation && (
                        <div>
                          <div className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Explanation:
                          </div>
                          <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200">
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {detail.explanation}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Action Buttons */}
        <div className="mt-8 bg-white/95 backdrop-blur-lg rounded-2xl shadow-lg p-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onBackToScore}
              className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Score
            </button>
            <button
              onClick={onRetake}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Retake Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizReport;