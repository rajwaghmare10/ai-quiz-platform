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

module.exports = router;