const express = require("express");
const router = express.Router();
const connectDB = require("../db"); // your MongoDB connect helper
const Post = require("../models/Post"); // adjust path if needed

// ================= GET POSTS BY USER =================
// GET /api/userPosts?user_id=123
router.get("/", async (req, res) => {
  try {
    await connectDB();

    const userId = req.query.user_id; // matches frontend parameter

    if (!userId) {
      return res.status(400).json({ error: "Missing userId parameter" });
    }

    const posts = await Post.find({ "user.userId": userId })
      .sort({ createdAt: -1 })
      .lean();

    res.json(posts || []);
  } catch (err) {
    console.error("Error fetching user posts:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
