const express = require("express");
const router = express.Router();
const Account = require("../models/Account"); // Your Mongo model

// ✅ CREATE ACCOUNT
router.post("/register", async (req, res) => {
  try {
    const account = await Account.create(req.body);
    res.json(account);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await Account.findOne({ email });

  if (!user) return res.status(404).json({ error: "User not found" });

  // TODO: add bcrypt compare
  if (user.password !== password)
    return res.status(401).json({ error: "Wrong password" });

  res.json(user);
});

// ✅ GET ACCOUNT BY ID
router.get("/:id", async (req, res) => {
  try {
    const user = await Account.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "Not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ DELETE ACCOUNT
router.delete("/:id", async (req, res) => {
  try {
    await Account.findByIdAndDelete(req.params.id);
    res.json({ message: "Account deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
