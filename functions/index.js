const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const express = require("express");
const cors = require("cors");

// Initialize Express
const app = express();
app.use(cors());
app.use(express.json());

// Import database functions
const { addPost, getPosts } = require("./database");

// Create a new blog post
app.post("/addPost", async (req, res) => {
  try {
    const { userId, title, content } = req.body;
    if (!userId || !title || !content) {
      return res.status(400).json({ error: "Missing fields" });
    }
    await addPost(userId, title, content);
    res.status(200).json({ message: "Post added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all blog posts
app.get("/getPosts", async (req, res) => {
  try {
    const posts = await getPosts();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Export as Firebase Function
exports.api = functions.https.onRequest(app);
