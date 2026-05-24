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

router.post("/", upload.single("video"), (req, res) => {

  const videoUrl =
    `/uploads/recordings/${req.file.filename}`;

  db.query(
    `
    INSERT INTO ai_recordings
    (video_url, violation_type)
    VALUES (?, ?)
    `,
    [
      videoUrl,
      req.body.violation_type
    ],
    (err, result) => {

      if (err) {
        console.log(err);

        return res.status(500).json({
          error: err.message
        });
      }

      res.json({
        success: true,
        video_url: videoUrl
      });
    }
  );
});

router.get("/", (req, res) => {

  db.query(
    `
    SELECT *
    FROM ai_recordings
    ORDER BY created_at DESC
    `,
    (err, rows) => {

      if (err) {
        console.log(err);

        return res.status(500).json({
          error: err.message
        });
      }

      res.json(rows);
    }
  );
});

module.exports = router;