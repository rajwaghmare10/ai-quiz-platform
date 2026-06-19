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
  "/:attemptId/result",
  authenticate,
  attemptController.getResult
);

module.exports = router;