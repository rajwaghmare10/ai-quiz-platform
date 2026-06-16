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

module.exports = router;