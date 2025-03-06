const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

// Initialize Firebase Admin SDK
admin.initializeApp();

// Initialize Express
const app = express();
app.use(cors());
app.use(express.json());

// Import database functions
const { addPost, getPosts, addComment, getComments } = require("./db.js");

// API Endpoint: Add a new blog post
app.post("/addPost", async (req, res) => {
  try {
    const { userId, title, content } = req.body;

    if (!userId || !title || !content) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const postId = await addPost(userId, title, content);
    res.status(200).json({ message: "Post added successfully", postId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API Endpoint: Fetch all blog posts
app.get("/getPosts", async (req, res) => {
  try {
    const posts = await getPosts();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API Endpoint: Add a comment to a post
app.post("/addComment", async (req, res) => {
  try {
    const { postId, userId, comment } = req.body;

    if (!postId || !userId || !comment) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const commentId = await addComment(postId, userId, comment);
    res.status(200).json({ message: "Comment added successfully", commentId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API Endpoint: Fetch comments for a specific post
app.get("/getComments/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await getComments(postId);
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Export the API as a Firebase Function
exports.api = functions.https.onRequest(app);
