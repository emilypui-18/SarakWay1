const express = require("express");
const router = express.Router();
const multer = require("multer");
const db = require("../db");
const { isAdmin } = require("./auth");

// 1. Setup Multer for video uploads
const storage = multer.diskStorage({
  destination: "uploads/recordings",
  filename: (req, file, cb) => {
    cb(null, Date.now() + ".mp4");
  },
});
const upload = multer({ storage });

// 2. POST route: Handles AI uploading a new video
// Protected by isAdmin (the Python script will need your 'x-test-mode' header)
router.post("/", isAdmin, upload.single("video"), (req, res) => {
  const videoUrl = `/uploads/recordings/${req.file.filename}`;

  db.query(
    "INSERT INTO ai_recordings (video_url, violation_type) VALUES (?, ?)",
    [videoUrl, req.body.violation_type],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ success: true, video_url: videoUrl });
    }
  );
});

// 3. GET route: Fetches data for your AdminDevice page
router.get("/", isAdmin, (req, res) => {
  db.query(
    "SELECT * FROM ai_recordings ORDER BY created_at DESC",
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    }
  );
});

module.exports = router;
