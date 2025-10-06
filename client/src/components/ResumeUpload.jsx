import React, { useState } from "react";
import { startQuiz } from "../api/quizApi";
import Loader from "./Loader";
import pdfToText from "react-pdftotext";
import {
  Upload,
  FileText,
  Sparkles,
  Award,
  ChevronRight,
  BookOpen,
} from "lucide-react";

const ResumeUpload = ({ onQuizStart }) => {
  const [file, setFile] = useState(null);
  const [difficulty, setDifficulty] = useState("medium");
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleParse = async () => {
    if (!file) return setError("Please upload a PDF file");
    if (file.size > 5 * 1024 * 1024)
      return setError("File too large. Max 5MB allowed.");

    setError("");
    setLoading(true);
    try {
      const text = await pdfToText(file);
      console.log("Resume parsed successfully 🎈")
      setResumeText(text);
    } catch (err) {
      setError("Failed to parse PDF text. Please try a valid PDF.");
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = async () => {
    if (!resumeText) return setError("Please parse a resume first");

    setError("");
    setLoading(true);
    try {
      const { quiz, sessionId } = await startQuiz(
        resumeText,
        difficulty,
        "12345"
      );
      onQuizStart({ quiz, sessionId });
    } catch {
      setError("Failed to start quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 flex items-center justify-center px-4 py-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-700"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-2xl w-full h-full relative z-10 flex flex-col overflow-hidden">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4 shadow-lg hover:bg-indigo-600">
            <Award className="w-9 h-9 text-white animate-pulse cursor-pointer hover:scale-105 duration-500 " />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Resu<span className="text-indigo-400">Mentor</span>
          </h1>
          <p className="text-indigo-200 text-sm">
            AI-Powered Resume Analysis & Skill Assessment
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden flex-1 flex flex-col max-h-full">
        

          {/* Content */}
          <div className="p-6 space-y-4 overflow-y-auto flex-1">
            {/* File Upload Section */}
            <div className="space-y-3">
              <label className=" text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600" />
                Resume Upload (PDF only)
              </label>

              <div className="relative">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="hidden"
                  id="file-upload"
                  disabled={loading}
                />
                <label
                  htmlFor="file-upload"
                  className={`flex flex-col items-center justify-center w-full h-30 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
                    file
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-indigo-400"
                  } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload
                      className={`w-10 h-10 mb-3 ${
                        file ? "text-indigo-600" : "text-gray-400"
                      }`}
                    />
                    {file ? (
                      <>
                        <p className="text-sm font-medium text-indigo-600 mb-1">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Click to change file
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="mb-2 text-sm text-gray-600">
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          PDF only (MAX. 10MB)
                        </p>
                      </>
                    )}
                  </div>
                </label>
              </div>

              <button
                onClick={handleParse}
                disabled={loading || !file}
                className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                  loading || !file
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                }`}
              >
                <FileText className="w-5 h-5" />
                Parse Resume
              </button>
            </div>

            {/* Success Message */}
            {resumeText && !error && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-white"
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
                <div>
                  <p className="text-green-800 font-semibold">
                    Resume Parsed Successfully!
                  </p>
                  <p className="text-green-600 text-sm">
                    Your skills have been analyzed
                  </p>
                </div>
              </div>
            )}

            {/* Difficulty Selection */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                Select Difficulty
              </label>

              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setDifficulty("easy")}
                  disabled={loading}
                  className={`py-2 px-3 rounded-xl font-semibold capitalize transition-all duration-200 ${
                    difficulty === "easy"
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg scale-105"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-102"
                  } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  Easy
                </button>
                <button
                  onClick={() => setDifficulty("medium")}
                  disabled={loading}
                  className={`py-2 px-3 rounded-xl font-semibold capitalize transition-all duration-200 ${
                    difficulty === "medium"
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-105"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-102"
                  } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  Medium
                </button>
                <button
                  onClick={() => setDifficulty("hard")}
                  disabled={loading}
                  className={`py-2 px-3 rounded-xl font-semibold capitalize transition-all duration-200 ${
                    difficulty === "hard"
                      ? "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg scale-105"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-102"
                  } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  Hard
                </button>
              </div>
            </div>

            {/* Start Quiz Button */}
            <button
              onClick={handleStartQuiz}
              disabled={loading || !resumeText}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                loading || !resumeText
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-xl hover:shadow-2xl transform hover:scale-[1.02]"
              }`}
            >
              {loading ? (
                "Processing..."
              ) : (
                <div className={`flex ${
                  resumeText
                  ? "animate-bounce"
                  :"animate-none "
                  }`}>
                  Start Quiz
                  <ChevronRight className="w-6 h-6" />
                </div>
              )}
            </button>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-8">
                <Loader className="w-12 h-12 text-indigo-600 animate-spin" />
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-2 border-t border-gray-200">
            <p className="text-xs text-gray-600 text-center">
              🔒 Your data is secure and will be used only for quiz generation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeUpload;
