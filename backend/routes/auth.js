const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../db");


/* ================= REGISTER ================= */
router.post("/register", async (req, res) => {
  const { user_name, email, password } = req.body;

  if (!user_name || !email || !password) {
    return res.status(400).json({ message: "all fields are required" });
  }

  try {
    // 🔍 check if email already exists
    const checkQuery = "SELECT * FROM users WHERE email = ?";

    db.query(checkQuery, [email], async (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "database error" });
      }

      if (results.length > 0) {
        return res.status(400).json({ message: "email already registered" });
      }

      // 🔢 check how many users exist
      const countQuery = "SELECT COUNT(*) AS count FROM users";

      db.query(countQuery, async (err, countResult) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "database error" });
        }

        const userCount = countResult[0].count;

        // 🧠 first user = admin, others = guide
        const role_id = userCount === 0 ? 1 : 2;

        // 🔐 hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const insertQuery = `
          INSERT INTO users (user_name, email, password_hash, role_id)
          VALUES (?, ?, ?, ?)
        `;

        db.query(
          insertQuery,
          [user_name, email, hashedPassword, role_id],
          (err, result) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ message: "failed to register" });
            }

            res.json({ message: "registration successful" });
          }
        );
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "server error" });
  }
});

/* ================= LOGIN ================= */
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const query = "SELECT * FROM users WHERE email = ?";

  db.query(query, [email], async (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "database error" });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "user not found" });
    }

    const user = results[0];

    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      return res.status(401).json({ message: "wrong password" });
    }

    const role = user.role_id === 1 ? "admin" : "guide";

    res.json({
      user_id: user.user_id,
      name: user.user_name,
      email: user.email,    
      phone: user.phone,   
      role: role,
    });
  });
});

module.exports = router;