# 🎓 RESUMENTOR

AI-powered quiz platform that generates personalized technical questions from your resume using **Google Gemini AI**.

## 🚀 Features
- Upload & parse resumes (PDF/DOC/DOCX)
- AI-generated contextual quiz (5 questions)
- Difficulty levels: Easy | Medium | Hard
- Clean quiz UI with progress tracking
- Detailed results & explanations
- MongoDB score tracking

## 🛠 Tech Stack
**Frontend:** React.js, Tailwind CSS, Lucide React, Vite  
**Backend:** Node.js, Express.js, MongoDB, Mongoose, Gemini AI, Multer  

## 📂 Structure

```

RESUMENTOR/
├── client/                    # Frontend React application
│   ├── src/
│   │   ├── api/
│   │   │   └── quizApi.js    # API integration
│   │   ├── assets/           # Static assets
│   │   ├── components/       # React components
│   │   │   ├── LoaderAi.jsx
│   │   │   ├── QuestionCard.jsx
│   │   │   └── ResumeUpload.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Quiz.jsx
│   │   │   └── QuizReport.jsx
│   │   ├── utils/
│   │   │   └── parseResume.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── server/                    # Backend Node.js application
├── config/
│   └── database.js       # MongoDB connection
├── controllers/
│   ├── quizController.js # Quiz logic
│   └── rateLimiter.js    # API rate limiting
├── middleware/
│   └── errorHandler.js   # Error handling
├── models/
│   ├── QuizSession.js    # Quiz session schema
│   └── Result.js         # Result schema
├── routes/
│   └── quizRoutes.js     # API routes
├── utils/
│   ├── geminiPrompt.js   # Gemini AI integration
│   └── testGemini.js     # API testing
└── server.js             # Entry point

```



## 🔌 API
- `POST /api/quiz/start` → start quiz `{ resumeText, difficulty }`  
- `POST /api/quiz/submit` → submit answers `{ sessionId, submittedAnswers }`  

## 📊 Schemas
**QuizSession:** sessionId, userId, resumeText, questions[], difficulty, createdAt  
**Result:** sessionId, userAnswers[], score, detailedResults[], completedAt  

## 📝 Setup
```bash
git clone https://github.com/yourusername/resumentor.git
cd resumentor

# Backend
cd server && npm install
# create .env with PORT, MONGODB_URI, GEMINI_API_KEY
npm run dev

# Frontend
cd ../client && npm install
npm run dev
Frontend→ http://localhost:5173
Backend → http://localhost:3000

## 👥 Author
AJ  

---

Made with ❤️ for developers to test their resume skills
