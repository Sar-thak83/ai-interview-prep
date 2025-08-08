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

// CORS configuration
const corsOptions = {
  origin: [
    "https://ai-interview-prep-mauve.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

// Handle preflight OPTIONS requests
app.options("*", cors(corsOptions));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log("Origin:", req.headers.origin);
  console.log("User-Agent:", req.headers["user-agent"]);
  next();
});

// Body parser middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Connect to database
console.log("Starting server...");
console.log("MongoDB URI exists:", !!process.env.MONGODB_URI);
console.log("JWT Secret exists:", !!process.env.JWT_SECRET);

connectDB().catch((err) => {
  console.error("Database connection failed:", err);
  process.exit(1);
});

// Health check endpoint - move before other routes
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is running",
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || "development",
  });
});

// API Routes with error boundaries
app.use(
  "/api/auth",
  (req, res, next) => {
    console.log("Auth route hit:", req.method, req.url);
    next();
  },
  authRoutes
);

app.use(
  "/api/sessions",
  (req, res, next) => {
    console.log("Sessions route hit:", req.method, req.url);
    next();
  },
  sessionRoutes
);

app.use(
  "/api/questions",
  (req, res, next) => {
    console.log("Questions route hit:", req.method, req.url);
    next();
  },
  questionRoutes
);

// AI routes - use POST method for specific endpoints
app.post(
  "/api/ai/generate-questions",
  (req, res, next) => {
    console.log("Generate questions route hit");
    next();
  },
  protect,
  generateInterviewQuestions
);

app.post(
  "/api/ai/generate-explanation",
  (req, res, next) => {
    console.log("Generate explanation route hit");
    next();
  },
  protect,
  generateConceptExplanation
);

// Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error occurred:");
  console.error("URL:", req.url);
  console.error("Method:", req.method);
  console.error("Error:", err);
  console.error("Stack:", err.stack);

  res.status(err.status || 500).json({
    message: "Internal server error",
    error:
      process.env.NODE_ENV === "production"
        ? "Something went wrong"
        : err.message,
    url: req.url,
    method: req.method,
  });
});

// 404 handler
app.use("*", (req, res) => {
  console.log("404 - Route not found:", req.method, req.originalUrl);
  res.status(404).json({ message: "Route not found", url: req.originalUrl });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
