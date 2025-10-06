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
You are a technical interviewer conducting a live interview session. Based on the candidate's resume below, generate exactly 5 multiple-choice questions at the specified difficulty level that simulate a real, interactive interview experience. Questions must be phrased naturally and conversationally, reflecting the tone and style of speaking to a candidate in person. Use clear, concise English with realistic interview-style slang or phrasing appropriate to each difficulty level.

RESUME:
"""
${resumeText}
"""

DIFFICULTY: ${difficulty}

Requirements:
- Focus strictly on the candidate's mentioned skills, technologies, projects, and experience.
- Each question must have 4 options (A–D).
- Questions should test practical understanding, debugging, best practices, or architectural thinking based on the difficulty:
  - easy: basics, definitions, syntax
  - medium: application, debugging, best practices
  - hard: architecture, optimization, edge cases
- Include questions involving candidate’s projects if possible only 2.
- The questions should be challenging and thought-provoking enough to confirm deep comprehension, even at easy level.
- Specify the correct answer as an index (0–3).
- Provide a clear, educational explanation for the correct answer.
- Indicate the specific skill being tested (e.g., React, MongoDB).

Output instructions:
- Return only a valid JSON array matching the following format, without any additional text or comments.
- Do not include markdown formatting, extraneous punctuation, or trailing commas.
- Embed any code snippets as plain strings inside option values or explanations.

Format example:
[
  {
    "question": "...",
    "options": ["...", "...", "...", "..."],
    "correctAnswer": 0,
    "explanation": "...",
    "skill": "..."
  }
]

Generate exactly 5 questions following these guidelines.

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
