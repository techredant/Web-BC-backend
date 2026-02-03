const express = require("express");
const router = express.Router();
const Post = require("../mongodb/models/post");

// ================== GET ALL POSTS ==================
router.get("/", async (req, res) => {
  try {
    const posts = await Post.getAllPosts(); // or Post.find()
    res.json(posts);
  } catch (err) {
    console.error("Fetch posts error:", err);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// ================== CREATE POST ==================
router.post("/", async (req, res) => {
  try {
    const { user, cast, imageUrl, scope } = req.body;

    const post = await Post.create({
      user,
      cast,
      imageUrl,
      scope,
      recastedBy: [],
    });

    res.json(post);
  } catch (err) {
    console.error("Create post error:", err);
    res.status(500).json({ error: "Failed to create post" });
  }
});

// ================== RECAST POST ==================
router.post("/:post_id/recast", async (req, res) => {
  try {
    const { post_id } = req.params;
    const { userId } = req.body;

    const post = await Post.findById(post_id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const hasRecasted = post.recastedBy.includes(userId);

    if (hasRecasted) {
      post.recastedBy = post.recastedBy.filter((id) => id !== userId);
    } else {
      post.recastedBy.push(userId);
    }

    // increment views
    post.viewCount = (post.viewCount || 0) + 1;

    await post.save();

    res.json({ recastedBy: post.recastedBy });
  } catch (err) {
    console.error("Recast error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
