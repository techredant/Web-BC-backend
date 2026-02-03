const express = require("express");
const router = express.Router();
const connectDB = require("../db"); // your MongoDB connect helper
const Profile = require("../models/Profile"); // adjust path if needed

// ================= GET ALL ACTIVE USERS =================
// GET /api/users
router.get("/", async (req, res) => {
  try {
    await connectDB();

    const users = await Profile.find({
      $or: [{ isArchived: false }, { isArchived: { $exists: false } }],
    }).lean();

    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
