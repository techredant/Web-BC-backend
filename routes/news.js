const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

// ================= GET NEWS POSTS =================
// GET /api/news
router.get("/", async (req, res) => {
  try {
    // Exclude "Personal Account" posts and archived
    const posts = await Post.find({
      category: { $ne: "Personal Account" },
      $or: [{ isArchived: false }, { isArchived: { $exists: false } }],
    })
      .sort({ createdAt: -1 })
      .populate({
        path: "comments",
        options: { sort: { createdAt: -1 } },
      })
      .lean();

    // Optional: convert dates and _id to string (for frontend consistency)
    const serializedPosts = posts.map((post) => ({
      ...post,
      _id: post._id.toString(),
      createdAt: post.createdAt?.toString(),
      updatedAt: post.updatedAt?.toString(),
    }));

    res.json(serializedPosts);
  } catch (err) {
    console.error("Fetch news posts error:", err);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

module.exports = router;
