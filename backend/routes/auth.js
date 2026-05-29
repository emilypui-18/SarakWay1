// backend/routes/auth.js
const express = require("express");
const router = express.Router();
const { CognitoJwtVerifier } = require("aws-jwt-verify");
const db = require("../db"); // Points up one level to backend/db

// 🛡️ Initialize Cognito Verifier
const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.AWS_USER_POOL_ID || "us-east-1_gttt21",
  tokenUse: "id",
  clientId: process.env.AWS_CLIENT_ID || "7b7krehjq1tdoo6h9qof35qn6l",
});

// 🛡️ Admin Shield Middleware Function
const isAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1];
    const payload = await verifier.verify(token);
    const cognitoSub = payload.sub;
    const email = payload.email;

    const query = `SELECT role_id FROM users WHERE user_id = ? OR email = ?`;
    db.query(query, [cognitoSub, email], (dbErr, results) => {
      if (dbErr) {
        console.error("Middleware DB Error:", dbErr);
        return res.status(500).json({ message: "Internal server authentication error" });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "User account not found in local database." });
      }

      if (results[0].role_id === 1) {
        req.user = payload;
        return next();
      } else {
        return res.status(403).json({ message: "Forbidden. Admin privileges required." });
      }
    });
  } catch (err) {
    console.error("Token Verification Failed:", err.message);
    return res.status(401).json({ message: "Invalid or expired session token." });
  }
};

// =============================================================================
// YOUR EXISTING AUTH ROUTES (e.g., login, register, etc.)
// =============================================================================
// ✨ ADD THIS REGISTER ROUTE ROUTE HERE ✨
router.post("/register", (req, res) => {
  const { user_name, email, password } = req.body;

  // 1. Basic validation check
  if (!user_name || !email) {
    return res.status(400).json({ success: false, message: "Missing required registration parameters." });
  }

  // 2. Insert user mapping details into your local MySQL database
  // Note: Defaulting role_id to 2 (Assuming 1 is Admin, 2 is Guide/User)
  const query = `INSERT INTO users (name, email, role_id) VALUES (?, ?, 2)`;
  
  db.query(query, [user_name, email], (dbErr, results) => {
    if (dbErr) {
      console.error("Database Registration Insertion Error:", dbErr);
      
      // Handle duplicate email constraint errors gracefully
      if (dbErr.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ success: false, message: "Email already registered in local database." });
      }
      
      return res.status(500).json({ success: false, message: "Database failure mapping user records." });
    }

    // 🌟 CRITICAL: Tell the frontend it succeeded so the button un-freezes!
    return res.status(200).json({
      success: true,
      message: "User account records mapped to local database successfully.",
      insertId: results.insertId
    });
  });
});

// backend/routes/auth.js (or wherever your authentication handlers are defined)
router.post("/login", (req, res) => {
  try {
    const { email } = req.body;
  
    if (!email) {
      return res.status(400).json({ message: "Email parameter required" });
    }
  
    const query = "SELECT user_id, name, email, role_id FROM users WHERE email = ?";
  
    db.query(query, [email], (err, results) => {
      if (err) {
        console.error("DATABASE SYNC ERROR:", err);
        return res.status(500).json({ message: "Internal server error" });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // UPDATED: Flatten the structure so the frontend receives 
      // user_id, role, etc., directly.
      res.json({
        user_id: results[0].user_id,
        user_name: results[0].name, // Map 'name' to 'user_name' to match your dashboard
        email: results[0].email,
        role: results[0].role_id // Maps to 'role'
      });
    });
  } catch (err) {
    console.error("Route Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// 💡 THE TRICK: Attach isAdmin directly to the router export
router.isAdmin = isAdmin;

module.exports = router;
