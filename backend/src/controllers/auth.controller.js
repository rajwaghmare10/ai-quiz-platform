// controllers/auth.controller.js

const authService = require("../services/auth.service");

// POST /auth/send-otp
const sendOtp = async (req, res) => {
  try {
    const result = await authService.sendRegistrationOtp(req.body);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// POST /auth/verify-otp
const verifyOtp = async (req, res) => {
  try {
    const user = await authService.verifyOtpAndRegister(req.body);
    return res.status(201).json({ success: true, data: user });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// POST /auth/login
const login = async (req, res) => {
  try {
    const result = await authService.loginUser(req.body);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  sendOtp,
  verifyOtp,
  login,
};