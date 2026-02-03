const express = require("express");
const router = express.Router();
const Followers = require("../mongodb/models/followers");
const Profile = require("../mongodb/models/profile");

// ================= GET FOLLOWERS & FOLLOWING =================
// /api/followers?userId=123
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.json({ following: [], followers: [] });

    // Find who user follows
    const followingDocs = await Followers.find({ follower: userId }).lean();

    // Find who follows user
    const followerDocs = await Followers.find({ following: userId }).lean();

    // Get profiles (slow way like your code)
    const followingProfiles = await Promise.all(
      followingDocs.map((f) => Profile.findOne({ userId: f.following }).lean())
    );

    const followerProfiles = await Promise.all(
      followerDocs.map((f) => Profile.findOne({ userId: f.follower }).lean())
    );

    res.json({
      following: followingProfiles.filter(Boolean),
      followers: followerProfiles.filter(Boolean),
    });
  } catch (err) {
    console.error("Followers fetch error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ================= FOLLOW USER =================
router.post("/", async (req, res) => {
  try {
    const { followerUserId, followingUserId } = req.body;

    if (!followerUserId || !followingUserId) {
      return res.status(400).json({ error: "Missing IDs" });
    }

    // Prevent duplicate follow
    const exists = await Followers.findOne({
      follower: followerUserId,
      following: followingUserId,
    });

    if (exists) return res.status(400).json({ error: "Already following" });

    const follow = await Followers.create({
      follower: followerUserId,
      following: followingUserId,
    });

    res.json(follow);
  } catch (err) {
    console.error("Follow error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ================= UNFOLLOW USER =================
router.delete("/", async (req, res) => {
  try {
    const { followerUserId, followingUserId } = req.body;

    if (!followerUserId || !followingUserId) {
      return res.status(400).json({ error: "Missing IDs" });
    }

    await Followers.deleteOne({
      follower: followerUserId,
      following: followingUserId,
    });

    res.json({ ok: true });
  } catch (err) {
    console.error("Unfollow error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
