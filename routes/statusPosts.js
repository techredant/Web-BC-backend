const express = require("express");
const router = express.Router();
const Status = require("../models/StatusPost");

// ================= GET SINGLE STATUS POST =================
// GET /api/statusPosts/:post_id
router.get("/:post_id", async (req, res) => {
  try {
    const { post_id } = req.params;

    const post = await Status.findById(post_id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    res.json(post);
  } catch (err) {
    console.error("Fetch status post error:", err);
    res.status(500).json({ error: "Failed to fetch post" });
  }
});

// ================= DELETE STATUS POST =================
// DELETE /api/statusPosts/:post_id
router.delete("/:post_id", async (req, res) => {
  try {
    const { post_id } = req.params;
    const { userId } = req.body;

    if (!userId) return res.status(400).json({ error: "Missing userId" });

    const post = await Status.findById(post_id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    // Check ownership
    if (post.user.userId !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Remove post
    if (typeof post.removePost === "function") {
      await post.removePost();
    } else {
      await post.deleteOne();
    }

    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("Delete status post error:", err);
    res.status(500).json({ error: "Failed to delete post" });
  }
});

module.exports = router;
