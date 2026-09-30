const User = require("../models/auth.model");
const { generateToken } = require("../utils/token");
//registration of user
// login
// logout
// forgot password
// reset password
// verify email

// Register User
const registerUser = async (req, res) => {
  const { username, fullname, email, password } = req.body || {};

  if (!username)
    return res.status(400).json({ message: "User Name is required" });
  if (!fullname)
    return res.status(400).json({ message: "Full Name is required" });
  if (!email) return res.status(400).json({ message: "Email is required" });
  if (!password)
    return res.status(400).json({ message: "Password is required" });

  const isUsernameExists = await User.findOne({ username });
  if (isUsernameExists)
    return res.status(400).json({ message: "User Name already exists" });

  const isEmailExists = await User.findOne({ email });
  if (isEmailExists)
    return res.status(400).json({ message: "Email already exists" });

  const createUser = await User.create({
    username,
    fullname,
    email,
    password,
  });
  res.status(201).json({ message: "You have successfully registered" });
};



const createAdmin = async (req, res) => {
  const { username, fullname, email, password } = req.body || {};

  if (!username)
    return res.status(400).json({ message: "User Name is required" });
  if (!fullname)
    return res.status(400).json({ message: "Full Name is required" });
  if (!email) return res.status(400).json({ message: "Email is required" });
  if (!password)
    return res.status(400).json({ message: "Password is required" });

  const isUsernameExists = await User.findOne({ username });
  if (isUsernameExists)
    return res.status(400).json({ message: "User Name already exists" });

  const isEmailExists = await User.findOne({ email });
  if (isEmailExists)
    return res.status(400).json({ message: "Email already exists" });

  const createUser = await User.create({
    username,
    fullname,
    email,
    password,
    role: "admin",
  });
  res.status(201).json({ message: "You have successfully registered as admin" });
};


// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body || {};

  if (!email) return res.status(400).json({ message: "Email is required" });
  if (!password)
    return res.status(400).json({ message: "Password is required" });

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });

  const isPasswordValid = await user.isPasswordCorrect(password);

  const token = generateToken(user);
  if (!isPasswordValid)
    return res.status(400).json({ message: "Invalid credentials" });

  const userResponse = user.toObject();
  delete userResponse.password;
  delete userResponse.role;

  res.status(200).json({ 
    message: "You have successfully logged in",
    token,
    user: userResponse
  });
};

// Logout User
const logoutUser = async (req, res) => {
}

// Forgot Password
const forgotPassword = () => {};

// Reset Password
const resetPassword = () => {};

// Verify Email
const verifyEmail = () => {};
module.exports = {
  createAdmin,
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  verifyEmail,
};
