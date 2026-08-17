// routes/auth.routes.js

const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

// Step 1: validate form data + send OTP email
router.post("/send-otp", authController.sendOtp);

// Step 2: verify OTP + create user account
router.post("/verify-otp", authController.verifyOtp);

// Login
router.post("/login", authController.login);

module.exports = router;