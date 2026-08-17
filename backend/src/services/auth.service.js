// services/auth.service.js

const bcrypt = require("bcrypt");
const crypto = require("crypto");
const authRepository = require("../repositories/auth.repository");
const { generateToken } = require("../utils/jwt");
const { sendOtpEmail } = require("../utils/email");
const { setOtp, getOtp, deleteOtp } = require("../utils/otpStore");

// ─── Helpers ─────────────────────────────────────────────────────────────────

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const generateOtp = () =>
  crypto.randomInt(100000, 999999).toString();

// ─── Step 1: Validate → store pending data → send OTP ─────────────────────

const sendRegistrationOtp = async ({ name, email, password, role }) => {

  if (!name || !name.trim()) {
    throw new Error("Name is required");
  }

  if (!email || !emailRegex.test(email)) {
    throw new Error("A valid email is required");
  }

  if (!password || password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  if (!["teacher", "student"].includes(role)) {
    throw new Error("Role must be either teacher or student");
  }

  const existingUser = await authRepository.findUserByEmail(email);
  if (existingUser) {
    throw new Error("Email already registered");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const otp = generateOtp();

  // Store OTP + pending user data (not yet in DB)
  setOtp(email, otp, { name: name.trim(), email, passwordHash, role });

  await sendOtpEmail(email, otp, name.trim());

  return { message: "OTP sent to your email. Please verify to complete registration." };
};

// ─── Step 2: Verify OTP → create user ─────────────────────────────────────

const verifyOtpAndRegister = async ({ email, otp }) => {

  if (!email || !otp) {
    throw new Error("Email and OTP are required");
  }

  const entry = getOtp(email);

  if (!entry) {
    throw new Error("OTP has expired or was not found. Please register again.");
  }

  if (entry.otp !== otp.trim()) {
    throw new Error("Invalid OTP. Please check and try again.");
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
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);

  if (!isMatch) {
    throw new Error("Invalid email or password");
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