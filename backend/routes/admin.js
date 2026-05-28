// routes/admin.js
const express = require("express");
const router = express.Router();
const db = require("../db");
const { isAdmin } = require("./auth");

// 🛡️ Apply the admin shield globally to ALL routes inside this file
router.use(isAdmin);

/* ================= GET ALL USERS ================= */
// Fetches all users along with their human-readable role names
router.get("/users", (req, res) => {
  const query = `
    SELECT u.user_id, u.user_name, u.email, u.created_at, u.role_id, r.role_name
    FROM users u
    JOIN roles r ON u.role_id = r.role_id
    ORDER BY u.created_at DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("ADMIN FETCH USERS ERROR:", err);
      return res.status(500).json({
        message: "Failed to fetch user directory",
      });
    }
    res.json(results);
  });
});

/* ================= UPDATE USER ROLE ================= */
// Allows an admin to promote/demote users (e.g., changing role_id between 1 and 2)
router.put("/users/:id/role", (req, res) => {
  const targetUserId = req.params.id;
  const { role_id } = req.body;

  if (!role_id) {
    return res.status(400).json({
      message: "Missing required role_id target field",
    });
  }

  const query = `
    UPDATE users 
    SET role_id = ? 
    WHERE user_id = ?
  `;

  db.query(query, [role_id, targetUserId], (err, result) => {
    if (err) {
      console.error("ADMIN UPDATE ROLE ERROR:", err);
      return res.status(500).json({
        message: "Failed to change user authorization level",
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Target user account not found",
      });
    }

    res.json({
      message: "User privileges updated successfully",
    });
  });
});

/* ================= DELETE USER ACCOUNT ================= */
// Completely purges a user record from your local database mapping
router.delete("/users/:id", (req, res) => {
  const targetUserId = req.params.id;

  const query = `
    DELETE FROM users 
    WHERE user_id = ?
  `;

  db.query(query, [targetUserId], (err, result) => {
    if (err) {
      console.error("ADMIN DELETE USER ERROR:", err);
      return res.status(500).json({
        message: "Failed to delete user account",
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Target user account not found",
      });
    }

    res.json({
      message: "User account successfully unlinked and deleted",
    });
  });
});

module.exports = router;
