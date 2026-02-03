const express = require("express");
const router = express.Router();
const Profile = require("../models/Profile");

// ================= SEARCH USERS =================
// GET /api/search?q=<query>
router.get("/", async (req, res) => {
  try {
    const q = req.query.q;

    let users;

    if (!q) {
      // Return all users if no query
      users = await Profile.find().lean();
    } else {
      // Case-insensitive search on firstName, lastName, or nickName
      const regex = new RegExp(q, "i");
      users = await Profile.find({
        $or: [
          { firstName: regex },
          { lastName: regex },
          { nickName: regex },
        ],
      }).lean();
    }

    res.json(users);
  } catch (err) {
    console.error("Search users error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
