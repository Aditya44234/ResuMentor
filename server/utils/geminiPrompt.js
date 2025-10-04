import axios from "axios";
import dotenv from "dotenv";
import JSON5 from "json5";
dotenv.config();

// Get API key from environment variables
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("❌ GEMINI_API_KEY is not set in environment variables");
}


const model = "gemini-2.0-flash";
const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

/**
 * Validates if the text is actually a resume
 * Returns simple yes/no validation
 * @param {string} resumeText - Raw text from PDF
 * @returns {Promise<{ isResume: boolean, message?: string }>}
 */
const validateResume = async (resumeText) => {
  try {
    const prompt = `
You are a resume validator. Analyze if the following text is actually a resume.

A valid resume typically contains sections like:
- Skills / Technical Skills
- Experience / Work Experience
- Projects
- Education
- Contact Information

If the text is clearly NOT a resume (random text, articles, books, etc.), return:
{"isResume": false, "message": "This doesn't appear to be a resume"}

If it IS a resume, return:
{"isResume": true}

Return ONLY valid JSON, nothing else.

Text to analyze:
"""
${resumeText.substring(0, 2000)}
"""
`;

    const response = await axios.post(
      url,
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      {
        headers: { "Content-Type": "application/json" },
        timeout: 30000, // 30 second timeout
      }
    );

    let rawText =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Remove markdown code fences if present
    rawText = rawText.replace(/```json|```/g, "").trim();

    const result = JSON.parse(rawText);
    return result;
  } catch (error) {
    console.error(
      "❌ Error validating resume:",
      error.response?.data || error.message
    );
    throw new Error("Failed to validate resume");
  }
};

/**
 * Generates 10 quiz questions from resume text using Gemini AI
 * @param {string} resumeText - Raw text extracted from PDF
 * @param {string} difficulty - Question difficulty: "easy" | "medium" | "hard"
 * @returns {Promise<Array>} Array of 10 question objects
 */
const generateQuizQuestions = async (resumeText, difficulty = "medium") => {
  try {
    const validDifficulties = ["easy", "medium", "hard"];
    if (!validDifficulties.includes(difficulty)) {
      throw new Error(`Invalid difficulty. Must be: ${validDifficulties.join(", ")}`);
    }

    const prompt = `
You are a technical interviewer. Based on the resume below, generate 5 multiple-choice questions at ${difficulty} level.

RESUME:
"""
${resumeText}
"""

DIFFICULTY: ${difficulty}

Instructions:
- Focus only on skills, technologies, and projects mentioned.
- Each question must have 4 options (A–D).
- Questions should test practical understanding, not memorization.
- Difficulty guide:
  • easy: basics, definitions, syntax
  • medium: application, debugging, best practices
  • hard: architecture, optimization, edge cases
- Include project-based questions if possible.
- correctAnswer must be an index (0–3).
- explanation must be clear and educational.
- skill must name the specific tech being tested (e.g., React, MongoDB).

Output rules:
- Return ONLY a valid JSON array.
- No markdown, comments, or extra text.
- No trailing commas.
- Embed any code as plain strings inside options or explanations.

Format:
[
  {
    "question": "...",
    "options": ["...", "...", "...", "..."],
    "correctAnswer": 0,
    "explanation": "...",
    "skill": "..."
  }
]

Generate exactly 5 questions in this format.
`;

    const response = await axios.post(
      url,
      {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      },
      { headers: { "Content-Type": "application/json" }, timeout: 60000 }
    );

    let rawText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    let cleaned = rawText
      .replace(/```json|```/g, "")
      .replace(/\\n/g, " ")                  // flatten embedded newlines
      .replace(/\n/g, " ")                   // flatten actual newlines
      .replace(/<([^>]+)>/g, "&lt;$1&gt;")   // escape JSX-like tags
      .trim();

    let questions;
    try {
      questions = JSON5.parse(cleaned);
    } catch (err) {
      console.error("❌ Failed to parse AI JSON. Raw output:", cleaned);
      throw new Error("AI returned invalid JSON format. Please try again.");
    }


    if (!Array.isArray(questions) || questions.length !== 5) {
      throw new Error(`Expected 5 questions, got ${questions?.length || 0}`);
    }

    questions.forEach((q, index) => {
      if (!q.question || !Array.isArray(q.options) || q.options.length !== 4) {
        throw new Error(`Invalid question structure at index ${index}`);
      }
      if (typeof q.correctAnswer !== "number" || q.correctAnswer < 0 || q.correctAnswer > 3) {
        throw new Error(`Invalid correctAnswer at index ${index}`);
      }
      if (!q.explanation || !q.skill) {
        throw new Error(`Missing explanation or skill at index ${index}`);
      }
    });

    return questions;
  } catch (error) {
    console.error("❌ Error generating quiz questions:", error.response?.data || error.message);
    throw error;
  }
};

export { validateResume, generateQuizQuestions };
