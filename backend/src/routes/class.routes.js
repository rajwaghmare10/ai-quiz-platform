const express = require("express");

const router = express.Router();

const { authenticate } = require("../middlewares/auth.middleware");

const classController = require("../controllers/class.controller");

const { authorize } = require("../middlewares/role.middleware");

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
module.exports = router;