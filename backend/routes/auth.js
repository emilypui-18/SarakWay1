// routes/auth.js
import { CognitoJwtVerifier } from "aws-jwt-verify";
import db from "../db"; // Adjust this path to point to your existing MySQL pool file

// Initialize the Cognito JWT Verifier 
const verifier = CognitoJwtVerifier.create({
  userPoolId: "us-east-1_L5j6Nvm4a",
  tokenUse: "id", 
  clientId: "7b7krehjq1tdoo6h9qof35qn6l", // Replace with your actual Cognito Client ID
});

async function isAdmin(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized. Missing token attributes." });
    }
    
    const token = authHeader.split(" ")[1];
    const payload = await verifier.verify(token);
    
    // Query MySQL using the connection instance imported above
    const [rows] = await db.query(
      "SELECT role_id FROM users WHERE email = ?", 
      [payload.email]
    );

    if (rows.length === 0 || rows[0].role_id !== 1) {
      return res.status(403).json({ message: "Access denied. Administrative privileges required." });
    }

    next();
  } catch (err) {
    console.error("Authorization check error:", err);
    return res.status(401).json({ message: "Invalid or expired authorization signature." });
  }
}

module.exports = { isAdmin };
