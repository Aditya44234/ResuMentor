import { validateResume, generateQuizQuestions } from "./geminiPrompt.js";

const runTest = async () => {
  // Sample resume text (replace with parsed text from pdfParser if you want)
  const resumeText = `
Aditya Joshi
Full-stack Developer skilled in React.js, Node.js, MongoDB, Express, Tailwind CSS, and TypeScript.
Built a Notes Manager App (MERN stack) and a Portfolio Website with React + Framer Motion.
`;

  // Choose difficulty level
  const difficulty = "hard"; // Options: "easy", "medium", "hard"

  try {
    console.log("⏳ Parsing resume with Gemini...");
    const parsed = await validateResume(resumeText);
    console.log("  ")
    console.log("\n⏳ Generating quiz...");
    const quiz = await generateQuizQuestions(parsed, difficulty);
    console.log("✅ Quiz Generated:\n", JSON.stringify(quiz, null, 2));
    console.log("Number of questions :- ", quiz.length);
  } catch (err) {
    console.error("❌ Test failed:", err.response?.data || err.message);
  }
};

runTest();
