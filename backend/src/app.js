const express = require("express");
const cors = require("cors");

const app = express();

const authRoutes = require("./routes/auth.routes");

const testRoutes = require("./routes/test.routes");

const classRoutes = require("./routes/class.routes");

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/test", testRoutes);

app.use( "/api/classes", classRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
  });
});

module.exports = app;