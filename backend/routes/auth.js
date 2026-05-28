// middleware/auth.js
import { CognitoJwtVerifier } from "aws-jwt-verify";
import db from "../db.js"; // Adjust this path to point to your existing MySQL pool file

// Initialize the Cognito JWT Verifier 
const verifier = CognitoJwtVerifier.create({
  userPoolId: "us-east-1_L5j6Nvm4a",
  tokenUse: "id", 
  clientId: "7b7krehjq1tdoo6h9qof35qn6l", // Replace with your actual Cognito Client ID
});

export async function isAdmin(req, res, next) {
  try {
    // 1. Extract the token from the request header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized. Missing or malformed token." });
    }
    
    const token = authHeader.split(" ")[1];
    
    // 2. Verify token legitimacy via AWS Cognito rules
    const payload = await verifier.verify(token);
    const userEmail = payload.email; 

    // 3. Query your local MySQL database using the email verified by Cognito
    const [rows] = await db.execute(
      `SELECT u.*, r.role_name 
       FROM users u 
       JOIN roles r ON u.role_id = r.role_id 
       WHERE u.email = ?`, 
      [userEmail]
    );

    if (rows.length === 0) {
      return res.status(403).json({ message: "Access denied. Profile records not found." });
    }

    const currentUser = rows[0];

    // 4. Enforce that role_id must be 1 (Admin)
    if (currentUser.role_id !== 1) {
      return res.status(403).json({ message: "Access denied. Administrator privileges required." });
    }

    // Attach user profile object to request context so down-line controllers can use it
    req.user = currentUser;
    
    // Everything checks out, let the request proceed to the route handler
    next();

  } catch (err) {
    console.error("Authorization workflow failure:", err);
    return res.status(401).json({ message: "Session expired or invalid authentication credentials token." });
  }
}
