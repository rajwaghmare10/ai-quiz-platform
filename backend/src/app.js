const express = require("express");
const cors = require("cors");

const app = express();

const authRoutes = require("./routes/auth.routes");

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
  });
});

module.exports = app;