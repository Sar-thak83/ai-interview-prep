require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const questionRoutes = require("./routes/questionRoutes");
const { protect } = require("./middlewares/authMiddleware");
const {
  generateInterviewQuestions,
  generateConceptExplanation,
} = require("./controllers/aiController");

const app = express();

// Allowed origins
const allowedOrigins = [
  "https://ai-interview-prep-mauve.vercel.app",
  "http://localhost:3000",
];

// ✅ CORS middleware first
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ Explicitly handle all OPTIONS requests before protect()
app.options(
  "*",
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Parse JSON
app.use(express.json());

// Connect DB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/questions", questionRoutes);

// Only apply protect() for actual requests, not OPTIONS
app.post(
  "/api/ai/generate-questions",
  (req, res, next) => {
    if (req.method === "OPTIONS") return res.sendStatus(200);
    protect(req, res, next);
  },
  generateInterviewQuestions
);

app.post(
  "/api/ai/generate-explanation",
  (req, res, next) => {
    if (req.method === "OPTIONS") return res.sendStatus(200);
    protect(req, res, next);
  },
  generateConceptExplanation
);

// Static uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Start
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
