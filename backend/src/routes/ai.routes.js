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

const pdfUpload = require("../middlewares/pdfUpload.middleware");

router.post(
  "/generate-from-pdf",
  authenticate,
  authorize("teacher"),
  pdfUpload.single("file"),
  aiController.generateFromPdf
);

module.exports = router;