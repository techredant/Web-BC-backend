const express = require("express");
const router = express.Router();
const Profile = require("../models/Profile"); // adjust path if needed
const connectDB = require("../db"); // your MongoDB connect helper

// ================= GET PROFILE BY USERID =================
// GET /api/profile?userId=123
router.get("/", async (req, res) => {
  try {
    await connectDB();

    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({ error: "Missing userId parameter" });
    }

    const user = await Profile.findOne({ userId }).lean();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
