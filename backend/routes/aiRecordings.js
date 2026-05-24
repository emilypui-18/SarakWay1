const express = require("express");
const router = express.Router();
const multer = require("multer");
const db = require("../db");

const storage = multer.diskStorage({
  destination: "uploads/recordings",
  filename: (req, file, cb) => {
    cb(null, Date.now() + ".mp4");
  },
});

const upload = multer({ storage });

router.post("/", upload.single("video"), async (req, res) => {
  try {

    const videoUrl =
      `/uploads/recordings/${req.file.filename}`;

    await db.query(
      `
      INSERT INTO ai_recordings
      (video_url, violation_type)
      VALUES (?, ?)
      `,
      [
        videoUrl,
        req.body.violation_type
      ]
    );

    res.json({
      success: true,
      video_url: videoUrl,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: err.message
    });
  }
});

router.get("/", async (req, res) => {

  const [rows] = await db.query(
    `
    SELECT *
    FROM ai_recordings
    ORDER BY created_at DESC
    `
  );

  res.json(rows);
});

module.exports = router;