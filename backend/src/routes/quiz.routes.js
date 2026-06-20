const express = require("express");

const router = express.Router();

const {
    authenticate
} = require("../middlewares/auth.middleware");

const {
    authorize
} = require("../middlewares/role.middleware");

const quizController =
require("../controllers/quiz.controller");

const attemptController =
  require("../controllers/attempt.controller");

router.post(
    "/",
    authenticate,
    authorize("teacher"),
    quizController.createQuiz
);

router.get(
  "/:quizId",
  authenticate,
  quizController.getQuizDetails
);

router.get(
  "/:quizId/attempts",
  authenticate,
  authorize("teacher"),
  attemptController.getQuizAttempts
);

router.get(
  "/:quizId/export",
  authenticate,
  authorize("teacher"),
  attemptController.exportQuizResults
);

module.exports = router;