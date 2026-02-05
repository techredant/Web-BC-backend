require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const serverless = require("serverless-http");

// ROUTES
const account = require("./routes/account");
const followers = require("./routes/followers");
const marketPosts = require("./routes/marketPosts");
const myProfile = require("./routes/myProfile");
const profileRoute = require("./routes/profile");
const news = require("./routes/news");
const posts = require("./routes/posts");
const search = require("./routes/search");
const statusPosts = require("./routes/statusPosts");
const user = require("./routes/user");
const userPosts = require("./routes/userPosts");

const app = express();
app.use(cors());
app.use(express.json());

let isConnected = false;

// DB CONNECTION
async function connectDB() {
  if (isConnected) return;

  await mongoose.connect(process.env.MONGODB_URI, {
    bufferCommands: false,
  });

  isConnected = true;
  console.log("MongoDB connected");
}

// Connect DB before routes
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("MongoDB error:", err);
    res.status(500).json({ error: "Database connection failed" });
  }
});

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ================= ROUTES =================
app.use("/api/account", account);
app.use("/api/profile", profileRoute);
app.use("/api/myProfile", myProfile);
app.use("/api/followers", followers);
app.use("/api/marketPosts", marketPosts);
app.use("/api/news", news);
app.use("/api/posts", posts);
app.use("/api/search", search);
app.use("/api/statusPosts", statusPosts);
app.use("/api/user", user);
app.use("/api/userPosts", userPosts);

// Export serverless handler
module.exports = app;
module.exports = serverless(app);
