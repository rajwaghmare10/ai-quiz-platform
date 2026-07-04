const bcrypt = require("bcrypt");
const authRepository = require("../repositories/auth.repository");

const registerUser = async ({
  name,
  email,
  password,
  role
}) => {

  if (!name || !name.trim()) {
    throw new Error("Name is required");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    throw new Error("A valid email is required");
  }

  if (!password || password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  if (!["teacher", "student"].includes(role)) {
    throw new Error("Role must be either teacher or student");
  }

  const existingUser =
    await authRepository.findUserByEmail(email);

  if (existingUser) {
    throw new Error("Email already registered");
  }

  const passwordHash =
    await bcrypt.hash(password, 10);

  const user =
    await authRepository.createUser({
      name,
      email,
      passwordHash,
      role
    });

  return user;
};


const { generateToken } =
  require("../utils/jwt");

const loginUser = async ({
  email,
  password,
}) => {

  const user =
    await authRepository.findUserByEmail(email);

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isMatch =
    await bcrypt.compare(
      password,
      user.password_hash
    );

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
  registerUser,
  loginUser,
};