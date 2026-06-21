const express = require("express");
const cors = require("cors");

const app = express();

const authRoutes = require("./routes/auth.routes");

const testRoutes = require("./routes/test.routes");

const classRoutes = require("./routes/class.routes");

const quizRoutes = require("./routes/quiz.routes");

const questionRoutes = require("./routes/question.routes");

const attemptRoutes = require("./routes/attempt.routes");

const aiRoutes = require("./routes/ai.routes");

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/test", testRoutes);

app.use( "/api/classes", classRoutes);

app.use("/api/quizzes", quizRoutes);

app.use("/api/questions",questionRoutes );

app.use("/api/attempts", attemptRoutes);

app.use("/api/ai", aiRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
  });
});

module.exports = app;