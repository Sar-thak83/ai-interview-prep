# Interview Prep AI

An AI-powered interview preparation app built with React and Vite. Create personalized interview sessions, generate questions and answers with Gemini, pin important questions, add notes, and view concept explanations.

![App Preview](/frontend/interview-prep-with-ai/src/assets/demo.png)
 
 [Live Site](https://ai-interview-prep-mauve.vercel.app/)

- Personalized sessions: generate tailored Q&A based on role, experience, and focus topics
- Pin/unpin questions and add notes for quick review
- AI-powered concept explanations with formatted code blocks
- Dashboard to view, open, and delete saved sessions

## Tech Stack
- Frontend: React, Vite, Tailwind CSS, React Router, Axios, React Icons, React Hot Toast, Framer Motion, React Syntax Highlighter
- Backend: Node.js, Express, MongoDB (Mongoose), JWT, Multer
- AI: Google Gemini via `@google/genai`

## Project Structure
```
frontend/interview-prep-with-ai
  ├─ src
  │  ├─ assets
  │  ├─ components
  │  ├─ context
  │  ├─ pages
  │  ├─ utils
  │  ├─ App.jsx
  │  └─ main.jsx
  ├─ index.html
  ├─ package.json
  └─ vite.config.js

backend
  ├─ controllers
  ├─ routes
  ├─ models
  ├─ middlewares
  ├─ config
  └─ server.js
```

## Frontend Setup
1. `cd frontend/interview-prep-with-ai`
2. `npm install`
3. `npm run dev`

Scripts: `npm run build`, `npm run preview`, `npm run lint`

API base URL is configured in `src/utils/api.js` and points to the deployed backend. Requests are made via `src/utils/axiosinstance.js` with an Authorization bearer token stored in localStorage.

## Backend Setup
1. `cd backend`
2. `npm install`
3. Create `.env` with:
   - `MONGO_URI=<your-mongodb-uri>`
   - `JWT_SECRET=<your-jwt-secret>`
   - `GEMINI_API_KEY=<your-gemini-api-key>`
4. `npm run dev` (or `npm start`)

Key routes:
- Auth: `/api/auth/register`, `/api/auth/login`, `/api/auth/profile`, `/api/auth/upload-image`
- Sessions: `/api/sessions/create`, `/api/sessions/my-sessions`, `/api/sessions/:id` (GET/DELETE)
- AI: `/api/ai/generate-questions`, `/api/ai/generate-explanation`

## Core Flows
- Create Session: client posts role/experience/topics to AI to get questions, then saves session and linked questions
- Dashboard: lists sessions for the logged-in user; open to view details; delete supported
- Question Actions: pin/unpin and add/update notes; add more questions to an existing session

## Useful File References
- Frontend API paths: `src/utils/api.js`
- Axios instance and auth header: `src/utils/axiosinstance.js`
- Session create form and submit: `src/pages/Home/CreateSessionForm.jsx`
- Dashboard listing and delete: `src/pages/Home/Dashboard.jsx`
- Interview page and fetch session: `src/pages/interviewPrep/interviewPrep.jsx`
- AI explanation viewer with code blocks: `src/pages/interviewPrep/components/AIResponsePreview.jsx`
- Question card actions: `src/components/Cards/QuestionCard.jsx`
- Backend session controller: `backend/controllers/sessionController.js`
- Backend question controller: `backend/controllers/questionController.js`
- Backend auth controller: `backend/controllers/authController.js`

## Notes
- Ensure the backend CORS origin matches your frontend deployment
- Image uploads are stored on the server and served from `/uploads`
