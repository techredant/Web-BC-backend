const express = require("express");
const router = express.Router();
const connectDB = require("../db"); // your MongoDB connect helper
const Post = require("../models/Post"); // your Post model

// ================= GET POST BY ID =================
// GET /api/posts/:post_id
router.get("/:post_id", async (req, res) => {
  try {
    await connectDB();

    const { post_id } = req.params;

    const post = await Post.findById(post_id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json(post);
  } catch (err) {
    console.error("Error fetching post:", err);
    res.status(500).json({ error: "An error occurred while fetching the post" });
  }
});

// ================= RECAST POST (toggle) =================
// POST /api/posts/:post_id/recast
router.post("/:post_id/recast", async (req, res) => {
  try {
    await connectDB();

    const { post_id } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const post = await Post.findById(post_id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (!Array.isArray(post.recastedBy)) post.recastedBy = [];

    const hasRecasted = post.recastedBy.includes(userId);

    if (hasRecasted) {
      post.recastedBy = post.recastedBy.filter(id => id !== userId);
    } else {
      post.recastedBy.push(userId);
    }

    await Post.updateOne({ _id: post_id }, { $inc: { viewCount: 1 } });
    await post.save();

    res.json({ recastedBy: post.recastedBy });
  } catch (err) {
    console.error("Error recasting post:", err);
    res.status(500).json({ error: "An error occurred while recasting the post" });
  }
});

// ================= DELETE POST =================
// DELETE /api/posts/:post_id
router.delete("/:post_id", async (req, res) => {
  try {
    await connectDB();

    const { post_id } = req.params;
    const { userId } = req.body;

    const post = await Post.findById(post_id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.user.userId !== userId) {
      return res.status(403).json({ error: "Post does not belong to the user" });
    }

    await post.removePost();

    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).json({ error: "An error occurred while deleting the post" });
  }
});

module.exports = router;
