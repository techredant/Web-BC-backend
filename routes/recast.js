const express = require("express");
const router = express.Router();
const Post = require("../mongodb/models/post");

// ================= RECAST / UNRECAST POST =================
// POST /api/recast/:post_id
router.post("/:post_id", async (req, res) => {
  try {
    const { post_id } = req.params;
    const { userId, userImg, firstName, nickName } = req.body;

    if (!userId) return res.status(400).json({ error: "Missing userId" });

    const post = await Post.findById(post_id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    // Ensure arrays exist
    if (!Array.isArray(post.recastedBy)) post.recastedBy = [];
    if (!Array.isArray(post.recastDetails)) post.recastDetails = [];

    if (post.recastedBy.includes(userId)) {
      // Remove recast
      post.recastedBy = post.recastedBy.filter((id) => id !== userId);
      post.recastDetails = post.recastDetails.filter(
        (detail) => detail.userId !== userId
      );
    } else {
      // Add recast
      post.recastedBy.push(userId);
      post.recastDetails.push({
        userId,
        userImg,
        firstName,
        nickName,
        recastedAt: new Date(),
      });
    }

    // Increment viewCount on recast
    post.viewCount = (post.viewCount || 0) + 1;

    await post.save();

    res.json({
      message: "Recast updated",
      recastedBy: post.recastedBy,
      recastDetails: post.recastDetails,
    });
  } catch (err) {
    console.error("Recast error:", err);
    res.status(500).json({ error: "Failed to update recast" });
  }
});

module.exports = router;
