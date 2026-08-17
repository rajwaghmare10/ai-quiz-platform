// services/auth.service.js

const bcrypt = require("bcrypt");
const crypto = require("crypto");
const authRepository = require("../repositories/auth.repository");
const { generateToken } = require("../utils/jwt");
const { sendOtpEmail } = require("../utils/email");
const { setOtp, getOtp, deleteOtp } = require("../utils/otpStore");

// ─── Custom error with HTTP status ───────────────────────────────────────────
class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const generateOtp = () =>
  crypto.randomInt(100000, 999999).toString();

// ─── Step 1: Validate → store pending data → send OTP ─────────────────────

const sendRegistrationOtp = async ({ name, email, password, role }) => {

  if (!name || !name.trim()) {
    throw new AppError("Name is required");
  }

  if (!email || !emailRegex.test(email)) {
    throw new AppError("A valid email is required");
  }

  if (!password || password.length < 6) {
    throw new AppError("Password must be at least 6 characters");
  }

  if (!role || !["teacher", "student"].includes(role)) {
    throw new AppError("Role must be either teacher or student");
  }

  const existingUser = await authRepository.findUserByEmail(email);
  if (existingUser) {
    throw new AppError("Email already registered");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const otp = generateOtp();

  // Store OTP + pending user data (not yet in DB)
  setOtp(email, otp, { name: name.trim(), email, passwordHash, role });

  try {
    await sendOtpEmail(email, otp, name.trim());
  } catch (emailErr) {
    // Log full error to Render logs so we can diagnose SMTP issues
    console.error("[OTP] Failed to send email to", email, emailErr);
    // Remove the stored OTP so the user can retry cleanly
    deleteOtp(email);
    throw new AppError(
      "Failed to send OTP email. Please check your email address or try again later.",
      500
    );
  }

  return { message: "OTP sent to your email. Please verify to complete registration." };
};

// ─── Step 2: Verify OTP → create user ─────────────────────────────────────

const verifyOtpAndRegister = async ({ email, otp }) => {

  if (!email || !otp) {
    throw new AppError("Email and OTP are required");
  }

  const entry = getOtp(email);

  if (!entry) {
    throw new AppError("OTP has expired or was not found. Please register again.");
  }

  if (entry.otp !== otp.trim()) {
    throw new AppError("Invalid OTP. Please check and try again.");
  }

  // OTP is valid — create the user
  const user = await authRepository.createUser(entry.userData);

  // Clean up the OTP store
  deleteOtp(email);

  return user;
};

// ─── Login ─────────────────────────────────────────────────────────────────

const loginUser = async ({ email, password }) => {

  const user = await authRepository.findUserByEmail(email);

  if (!user) {
    throw new AppError("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);

  if (!isMatch) {
    throw new AppError("Invalid email or password");
  }

  const token = generateToken({
    userId: user.user_id,
    role: user.role,
  });

  return {
    token,
    user: {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

module.exports = {
  sendRegistrationOtp,
  verifyOtpAndRegister,
  loginUser,
};