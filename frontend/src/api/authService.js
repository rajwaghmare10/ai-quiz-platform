import axiosInstance from "./axiosInstance";

const login = async (credentials) => {
  const response = await axiosInstance.post("/auth/login", credentials);
  return response.data.data;
};

// Step 1: Send OTP to the user's email
const sendOtp = async (userData) => {
  const response = await axiosInstance.post("/auth/send-otp", userData);
  return response.data.data;
};

// Step 2: Verify OTP and create the account
const verifyOtp = async ({ email, otp }) => {
  const response = await axiosInstance.post("/auth/verify-otp", { email, otp });
  return response.data.data;
};

const authService = {
  login,
  sendOtp,
  verifyOtp,
};

export default authService;