const express = require("express");

const router = express.Router();

const {
    authenticate
} = require("../middlewares/auth.middleware");

const {
    authorize
} = require("../middlewares/role.middleware");

const aiController =
    require("../controllers/ai.controller");

router.post(
    "/generate",
    authenticate,
    authorize("teacher"),
    aiController.generateQuestions
);

router.post(
    "/save-generated-questions",
    authenticate,
    authorize("teacher"),
    aiController.saveGeneratedQuestions
);

module.exports = router;