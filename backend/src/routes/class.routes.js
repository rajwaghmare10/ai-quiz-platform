const express = require("express");

const router = express.Router();

const { authenticate } = require("../middlewares/auth.middleware");

const classController = require("../controllers/class.controller");

const { authorize } = require("../middlewares/role.middleware");

const quizController = require("../controllers/quiz.controller");

router.post(
    "/",
    authenticate,
    authorize("teacher"),
    classController.createClass
);

router.get(
    "/",
    authenticate,
    authorize("teacher"),
    classController.getMyClasses
);

router.post(
    "/join",
    authenticate,
    authorize("student"),
    classController.joinClass
);

router.get(
    "/joined",
    authenticate,
    authorize("student"),
    classController.getJoinedClasses
);

router.get(
    "/:classId",
    authenticate,
    classController.getClassDetails
);

router.get(
  "/:classId/students",
  authenticate,
  authorize("teacher"),
  classController.getClassStudents
);

router.get(
  "/:classId/quizzes",
  authenticate,
  authorize("teacher", "student"),
  quizController.getQuizzesByClass
);

router.delete(
  "/:classId",
  authenticate,
  authorize("teacher"),
  classController.deleteClass
);

module.exports = router;