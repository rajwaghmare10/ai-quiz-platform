const express = require("express");
const router = express.Router();

const { authenticate } =
require("../middlewares/auth.middleware");

router.get(
  "/profile",
  authenticate,
  (req, res) => {
    res.json({
      success: true,
      user: req.user
    });
  }
);

module.exports = router;