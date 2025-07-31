// Import required modules and dependencies
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sql, poolPromise } = require("../models/db");

// Validation middleware for user registration
const validateUser = [
  body("username")
    .trim()
    .notEmpty().withMessage("Username is required")
    .isLength({ min: 3, max: 30 }).withMessage("Username must be 3-30 characters")
    .matches(/^[a-zA-Z0-9_ ]+$/).withMessage("Username can only contain letters, numbers, underscores, and spaces"),
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Email is invalid")
    .normalizeEmail(),
  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
    .matches(/[a-z]/).withMessage("Password must contain a lowercase letter")
    .matches(/[A-Z]/).withMessage("Password must contain an uppercase letter")
    .matches(/\d/).withMessage("Password must contain a number")
    .matches(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/).withMessage("Password must contain a special character"),
];

// Register a new user
const registerUser = async (req, res) => {
  // Validate request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { username, email, password, role } = req.body;
  const userRole = role || "customer"; // Default role is 'customer' if not provided

  try {
    const pool = await poolPromise;

    // Check if user with given email or username already exists
    const checkUser = await pool
      .request()
      .input("email", sql.VarChar, email)
      .input("username", sql.VarChar, username)
      .query("SELECT * FROM Users WHERE email = @email OR username = @username");

    if (checkUser.recordset.length > 0) {
      return res
        .status(409)
        .json({ message: "User with this email or username already exists" });
    }

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 12);

    // Insert new user into database
    await pool
      .request()
      .input("username", sql.VarChar, username)
      .input("email", sql.VarChar, email)
      .input("PasswordHash", sql.NVarChar, hashedPassword)
      .input("role", sql.VarChar, userRole)
      .query(
        "INSERT INTO Users (Username, Email, PasswordHash, Role) VALUES (@username, @email, @PasswordHash, @role)"
      );

    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    // Log error and send server error response
    console.error("Error in registerUser:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Login user and generate JWT token
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const pool = await poolPromise;
    // Fetch user by email
    const userResult = await pool
      .request()
      .input("email", sql.VarChar, email)
      .query("SELECT * FROM Users WHERE Email = @email");

    if (userResult.recordset.length === 0) {
      // User not found
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = userResult.recordset[0];
    // Compare provided password with stored hash
    const isMatch = await bcrypt.compare(password, user.PasswordHash);
    if (!isMatch) {
      // Password does not match
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Always send lowercase role and username
    const username = user.Username || user.UserName;
    const role = (user.Role || '').toLowerCase();

    // Generate JWT token with user info
    const token = jwt.sign(
      {
        userId: user.UserID,
        username,
        role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: "Login successful",
      userId: user.UserID,
      username,
      role,
      token
    });
  } catch (error) {
    // Log error and send server error response
    console.error("Error in loginUser:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Export controller functions and validation middleware
module.exports = {
  validateUser,
  registerUser,
  loginUser,
};