const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

// ================= UNLIKE POST =================
// POST /api/unlikePost/:post_id
router.post("/:post_id", async (req, res) => {
  try {
    const { post_id } = req.params;
    const { userId } = req.body;

    if (!userId) return res.status(400).json({ error: "Missing userId" });

    const post = await Post.findById(post_id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    // Call your model method
    if (typeof post.unlikePost === "function") {
      await post.unlikePost(userId);
    } else {
      // fallback: manually remove userId from likes array
      if (Array.isArray(post.likes)) {
        post.likes = post.likes.filter((id) => id !== userId);
        await post.save();
      }
    }

    res.json({ message: "Post unliked successfully" });
  } catch (err) {
    console.error("Error unliking post:", err);
    res.status(500).json({ error: "Failed to unlike post" });
  }
});

module.exports = router;
