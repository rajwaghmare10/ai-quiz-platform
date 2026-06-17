const express = require("express");

const router = express.Router();

const {
  authenticate
} = require("../middlewares/auth.middleware");

const {
  authorize
} = require("../middlewares/role.middleware");

const attemptController =
  require("../controllers/attempt.controller");

router.post(
  "/:quizId/start",
  authenticate,
  authorize("student"),
  attemptController.startQuiz
);

module.exports = router;