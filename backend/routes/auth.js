// backend/routes/auth.js
const express = require("express");
const router = express.Router();
const { CognitoJwtVerifier } = require("aws-jwt-verify");
const db = require("../db"); // Points up one level to backend/db

// 🛡️ Initialize Cognito Verifier
const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.AWS_USER_POOL_ID || "us-east-1_gttt21",
  tokenUse: "id",
  clientId: process.env.AWS_CLIENT_ID || "YOUR_COGNITO_APP_CLIENT_ID",
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
router.post("/login", (req, res) => {
  // Your login route logic here...
  res.json({ message: "Auth route working" });
});


// 💡 THE TRICK: Attach isAdmin directly to the router export
router.isAdmin = isAdmin;

module.exports = router;
