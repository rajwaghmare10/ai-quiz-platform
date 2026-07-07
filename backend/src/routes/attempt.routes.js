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

router.post(
  "/:attemptId/submit",
  authenticate,
  authorize("student"),
  attemptController.submitQuiz
);

router.get(
  "/:attemptId/questions",
  authenticate,
  authorize("student"),
  attemptController.getAttemptQuestions
);

router.get(
  "/:attemptId/result",
  authenticate,
  attemptController.getResult
);

router.get(
  "/quiz/:quizId",
  authenticate,
  authorize("teacher"),
  attemptController.getQuizAttempts
);

router.get(
  "/quiz/:quizId/export",
  authenticate,
  authorize("teacher"),
  attemptController.exportQuizResults
);

module.exports = router;