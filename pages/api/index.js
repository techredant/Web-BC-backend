import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import serverless from "serverless-http";

// ROUTES
import account from "../../routes/account";
import followers from "../../routes/followers";
import marketPosts from "../../routes/marketPosts";
import myProfile from "../../routes/myProfile";
import profileRoute from "../../routes/profile";
import news from "../../routes/news";
import posts from "../../routes/posts";
import search from "../../routes/search";
import statusPosts from "../../routes/statusPosts";
import user from "../../routes/user";
import userPosts from "../../routes/userPosts";

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

export const config = {
  api: {
    bodyParser: false,
  },
};

export default serverless(app);
