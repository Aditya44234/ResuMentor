import axios from "axios";

const BASE_URL = "https://resumentor-server.onrender.com/api"; // update if needed

export async function startQuiz(resumeText, difficulty, userId) {
    const response = await axios.post(`${BASE_URL}/quiz/start`, {
        resumeText,
        difficulty,
        userId,
    });
    return response.data;
}

export async function submitQuiz(sessionId, userId, submittedAnswers) {
    const response = await axios.post(`${BASE_URL}/quiz/submit`, {
        sessionId,
        userId,
        submittedAnswers,
    });
    return response.data.result;
}