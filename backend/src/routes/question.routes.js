const express = require("express");

const router = express.Router();

const upload =
require("../middlewares/upload.middleware");

const {
    authenticate
} = require("../middlewares/auth.middleware");

const {
    authorize
} = require("../middlewares/role.middleware");

const questionController =
require("../controllers/question.controller");

router.post(
    "/:quizId/excel",
    authenticate,
    authorize("teacher"),
    upload.single("file"),
    questionController.uploadExcelQuestions
);

module.exports = router;