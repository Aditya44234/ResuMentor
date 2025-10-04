import React, { useState, useEffect } from "react";
import { RotateCw ,RefreshCw } from 'lucide-react';
const Loader = () => {
  const [loadingMessage, setLoadingMessage] = useState(0);
  const messages = [
    "Analyzing your resume...",
    "Identifying your skills...",
    "Generating personalized questions...",
    "Almost ready for your quiz...",
  ];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setLoadingMessage((prevMessage) => (prevMessage + 1) % messages.length);
    }, 2000);
    return () => clearInterval(intervalId);
  }, [messages.length]);

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 bg-opacity-95 backdrop-blur-sm z-50">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-700"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-12 max-w-md w-full mx-4">
        {/* Animated spinner */}
        <div className="relative mb-8">
        <RefreshCw size={40} className=" text-indigo-900  rounded-full  animate-spin"/>
          <div className="absolute inset-0 w-20 h-20 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 blur-xl opacity-50 animate-pulse"></div>
        </div>

        {/* Loading message with fade transition */}
        <div className="h-16 flex items-center justify-center">
          <span
            key={loadingMessage}
            className="text-xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent text-center animate-fade-in"
          >
            {messages[loadingMessage]}
          </span>
        </div>

        {/* Progress dots */}
        <div className="flex gap-2 mt-6">
          {messages.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === loadingMessage
                  ? "w-8 bg-gradient-to-r from-indigo-600 to-purple-600"
                  : "w-2 bg-gray-300"
              }`}
            ></div>
          ))}
        </div>

        {/* Additional context text */}
        <p className="text-sm text-gray-500 mt-6 text-center">
          Please wait while we prepare everything for you
        </p>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Loader;
