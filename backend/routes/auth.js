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

router.post("/login", (req, res) => {
  const { email, cognito_sub, name } = req.body;

  // 1. Basic check to ensure the frontend sent the required identifier
  if (!email) {
    return res.status(400).json({ 
      success: false, 
      message: "Email parameters are required for local authentication processing." 
    });
  }

  // 2. Query to see if this user profile already has a record in your local DB
  const findUserQuery = `SELECT * FROM users WHERE email = ?`;

  db.query(findUserQuery, [email], (err, results) => {
    if (err) {
      console.error("Database Login Retrieval Error:", err);
      return res.status(500).json({ success: false, message: "Database connection failure." });
    }

    if (results.length > 0) {
      // User exists! Return their profile and role data back to the frontend
      const user = results[0];
      return res.status(200).json({
        success: true,
        message: "Authentication successful.",
        user: {
          id: user.user_id,
          name: user.name,
          email: user.email,
          role_id: user.role_id // 1 for Admin, 2 for Guide, etc.
        }
      });
    } else {
      // 3. Fallback / Sync Mechanism: If they successfully authenticated with Cognito 
      // but don't exist in MySQL yet, auto-create their local record on the fly.
      console.log(`User ${email} not found locally. Syncing record into database...`);
      
      const insertUserQuery = `INSERT INTO users (name, email, role_id) VALUES (?, ?, 2)`;
      const displayName = name || email.split('@')[0]; // Fallback name placeholder

      db.query(insertUserQuery, [displayName, email], (insertErr, insertResults) => {
        if (insertErr) {
          console.error("Failed to auto-provision user in local DB:", insertErr);
          return res.status(500).json({ success: false, message: "Failed to map authenticated session profile." });
        }

        return res.status(200).json({
          success: true,
          message: "Authentication successful. Local account initialized.",
          user: {
            id: insertResults.insertId,
            name: displayName,
            email: email,
            role_id: 2 // Default Guide/User permission tier
          }
        });
      });
    }
  });
});


// 💡 THE TRICK: Attach isAdmin directly to the router export
router.isAdmin = isAdmin;

module.exports = router;
