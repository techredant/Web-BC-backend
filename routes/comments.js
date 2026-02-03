const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

// ================= GET COMMENTS =================
router.get("/:post_id", async (req, res) => {
  try {
    const { post_id } = req.params;

    const post = await Post.findById(post_id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    // If you have a custom method
    const comments = await post.getAllComments();
    // OR fallback:
    // const comments = post.comments;

    res.json(comments);
  } catch (err) {
    console.error("Fetch comments error:", err);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

// ================= ADD COMMENT =================
router.post("/:post_id", async (req, res) => {
  try {
    const { post_id } = req.params;
    const { user, text } = req.body;

    if (!user || !text) {
      return res.status(400).json({ error: "Missing user or text" });
    }

    const post = await Post.findById(post_id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const comment = { user, text };

    // If you have a custom method
    await post.commentOnPost(comment);
    // OR fallback:
    // post.comments.push(comment);
    // await post.save();

    res.json({ message: "Comment added successfully" });
  } catch (err) {
    console.error("Add comment error:", err);
    res.status(500).json({ error: "Failed to add comment" });
  }
});

module.exports = router;
