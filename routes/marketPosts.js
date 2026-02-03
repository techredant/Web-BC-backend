const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

// ================= GET SINGLE POST =================
// GET /api/marketPosts/:post_id
router.get("/:post_id", async (req, res) => {
  try {
    const { post_id } = req.params;

    const post = await Post.findById(post_id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    res.json(post);
  } catch (err) {
    console.error("Fetch market post error:", err);
    res.status(500).json({ error: "Failed to fetch post" });
  }
});

// ================= DELETE POST =================
// DELETE /api/marketPosts/:post_id
router.delete("/:post_id", async (req, res) => {
  try {
    const { post_id } = req.params;
    const { userId } = req.body; // frontend must send userId

    if (!userId) return res.status(400).json({ error: "Missing userId" });

    const post = await Post.findById(post_id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    // Check ownership
    if (post.user.userId !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Remove post
    // Assuming your Post model has a custom method removePost()
    if (typeof post.removePost === "function") {
      await post.removePost();
    } else {
      await post.removeOne(); // fallback
    }

    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("Delete market post error:", err);
    res.status(500).json({ error: "Failed to delete post" });
  }
});

module.exports = router;
