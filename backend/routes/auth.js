const express = require("express");
const router = express.Router();
const prisma = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// SIGNUP ROUTE
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists using Prisma
    const userExist = await prisma.user.findUnique({
      where: { email: email }
    });

    if (userExist) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Encrypt user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save user to Database using Prisma programmatic methods
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "user" // Preserves Phase 7 default role routing
      }
    });

    res.status(201).json({
      message: "User Registered",
      user: { id: newUser.id, name: newUser.name, email: newUser.email }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// LOGIN ROUTE
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Look up the user by unique email property using Prisma
    const user = await prisma.user.findUnique({
      where: { email: email }
    });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Compare encrypted passwords directly against the database object fields
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({ message: "Wrong Password" });
    }

    // 1. Generate short-lived Access Token containing the user's role payload
    const accessToken = jwt.sign(
      { id: user.id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: "15m" }
    );

    // 2. Generate long-lived Refresh Token containing the user's role payload
    const refreshToken = jwt.sign(
      { id: user.id, role: user.role }, 
      process.env.REFRESH_SECRET, 
      { expiresIn: "30d" }
    );

    // 3. Save the active refresh token into your database via Prisma relations model
    await prisma.refreshToken.create({
      data: {
        user_id: user.id,
        token: refreshToken
      }
    });

    // 4. Send BOTH tokens back to the client
    return res.json({
      message: "Login Success!",
      token: accessToken,
      refreshToken: refreshToken
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const crypto = require("crypto"); // Built-in Node module to generate random characters

// 1. Endpoint to generate a verification token (Simulates sending an email)
router.post("/send-verification", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const userId = user.id;
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // Expires in 15 minutes

    // Save token to database
    await prisma.verificationToken.create({
      data: {
        user_id: userId,
        token,
        expires_at: expiresAt
      }
    });

    // This prints the link in your terminal so you can copy-paste it to test later!
    console.log(`Verification Link: http://localhost:3000/verify-email/${token}`);
    
    res.json({ message: "Verification link generated in backend console!" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// 2. Endpoint that handles checking the token when the link is clicked
router.get("/verify-email/:token", async (req, res) => {
  const { token } = req.params;
  try {
    // Check if token exists and isn't expired
    const tokenResult = await prisma.verificationToken.findFirst({
      where: { token, expires_at: { gt: new Date() } }
    });

    if (!tokenResult) {
      return res.status(400).json({ message: "Token invalid or expired." });
    }

    const userId = tokenResult.rows[0].user_id;

    // Change user to verified
    await prisma.user.update({
      where: { id: userId },
      data: { verified: true }
    });

    // Delete the token so it can't be reused
    await prisma.verificationToken.deleteMany({ where: { token } });

    res.json({ message: "Account successfully verified! You can now log in." });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// 1. Endpoint to issue a brand new Access Token using a valid Refresh Token
router.post("/refresh-token", async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ message: "Refresh Token Required" });

  try {
    // Check if the token currently exists inside our PostgreSQL database tracking table
    const tokenResult = await prisma.refreshToken.findFirst({ where: { token: refreshToken } });
    if (!tokenResult) return res.status(403).json({ message: "Invalid or Revoked Refresh Token" });

    // Verify the validity of the signature
    jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ message: "Expired Refresh Token" });

      // Generate a fresh, brand new short-lived access token
      const newAccessToken = jwt.sign(
        { id: decoded.id }, 
        process.env.JWT_SECRET, 
        { expiresIn: "15m" } // 15-minute validity window
      );

      res.json({ accessToken: newAccessToken });
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// 2. Endpoint to log out and safely clear/destroy the active session from the database
router.post("/logout", async (req, res) => {
  const { refreshToken } = req.body;
  try {
    // Delete the token completely so it can never be used to request access again
    await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Import your new role validation gatekeeper
const authorize = require("../middleware/authorize");
const authMiddleware = require("../middleware/auth"); // Your token validation helper

// Secure Administrative Endpoint
// Both middlewares are chained: first verifies who you are, second verifies your role
router.get("/admin-only", authMiddleware, authorize(["admin"]), (req, res) => {
  res.json({ message: "Welcome Admin! You have granted access to this private data panel." });
});

module.exports = router;