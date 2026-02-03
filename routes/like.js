const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

// ================= GET LIKES =================
// GET /api/likes/:post_id
router.get("/:post_id", async (req, res) => {
  try {
    const { post_id } = req.params;

    const post = await Post.findById(post_id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    res.json(post.likes);
  } catch (err) {
    console.error("Fetch likes error:", err);
    res.status(500).json({ error: "Failed to fetch likes" });
  }
});

// ================= LIKE / UNLIKE POST =================
// POST /api/likes/:post_id
router.post("/:post_id", async (req, res) => {
  try {
    const { post_id } = req.params;
    const { userId } = req.body;

    if (!userId) return res.status(400).json({ error: "Missing userId" });

    const post = await Post.findById(post_id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    // Toggle like
    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter((id) => id !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();

    res.json({ likes: post.likes });
  } catch (err) {
    console.error("Like error:", err);
    res.status(500).json({ error: "Failed to like post" });
  }
});

module.exports = router;
