// utils/otpStore.js
//
// In-memory OTP store.
// Stores both the OTP and the pending registration data so we can
// create the user only after email verification succeeds.
//
// Structure of each entry:
//   {
//     otp:       "123456",
//     expiresAt: Date,          // 10 minutes from creation
//     userData:  { name, email, passwordHash, role }
//   }

const store = new Map();

const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes

/**
 * Save an OTP + pending user data for the given email.
 */
const setOtp = (email, otp, userData) => {
  store.set(email.toLowerCase(), {
    otp,
    expiresAt: new Date(Date.now() + OTP_TTL_MS),
    userData,
  });
};

/**
 * Retrieve the stored entry for an email.
 * Returns null if not found or expired.
 */
const getOtp = (email) => {
  const entry = store.get(email.toLowerCase());
  if (!entry) return null;

  if (new Date() > entry.expiresAt) {
    store.delete(email.toLowerCase());
    return null;
  }

  return entry;
};

/**
 * Remove the stored entry (call after successful verification).
 */
const deleteOtp = (email) => {
  store.delete(email.toLowerCase());
};

module.exports = { setOtp, getOtp, deleteOtp };
