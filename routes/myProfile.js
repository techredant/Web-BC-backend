const express = require("express");
const router = express.Router();
const Profile = require("../models/Profile");
const Post = require("../models/Post");

// ✅ Update profile image
router.post("/update-image", async (req, res) => {
  try {
    const { userId, userImg } = req.body;

    if (!userId || !userImg) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Update profile image
    const profile = await Profile.findOneAndUpdate(
      { userId },
      { userImg },
      { new: true }
    );

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Update all posts user image
    await Post.updateMany(
      { "user.userId": userId },
      { $set: { "user.userImg": userImg } }
    );

    return res.json({
      message: "Profile image updated in profile & posts",
      profile,
    });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
