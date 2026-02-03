const express = require("express");
const router = express.Router();
const serverClient = require("../lib/streamServer"); // Make sure path is correct

// ================= CREATE STREAM TOKEN =================
// POST /api/getToken
router.post("/", async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const token = serverClient.createToken(userId);

    res.json({ token });
  } catch (err) {
    console.error("Error creating Stream token:", err);
    res.status(500).json({ error: "Failed to create token" });
  }
});

module.exports = router;
