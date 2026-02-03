const express = require("express");
const router = express.Router();
const Profile = require("../models/Profile");

// Middleware to get user (replace with JWT or Clerk backend verification)
const authMiddleware = (req, res, next) => {
  // Example: frontend sends userId in headers
  const userId = req.headers["x-user-id"];

  if (!userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  req.user = { id: userId };
  next();
};

// GET MY PROFILE
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const profile = await Profile.findOne({
      userId,
      $or: [{ isArchived: false }, { isArchived: { $exists: false } }],
    }).lean();

    if (!profile) {
      return res.status(404).json({ error: "Profile not found or archived" });
    }

    res.json(profile);
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
