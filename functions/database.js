const sqlite3 = require("sqlite3").verbose();

// Initialize SQLite database
const db = new sqlite3.Database("blog.db");

// Create tables if they don't exist
db.serialize(() => {
  // Posts table
  db.run(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId TEXT NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Comments table
  db.run(`
    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      postId INTEGER NOT NULL,
      userId TEXT NOT NULL,
      comment TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (postId) REFERENCES posts (id)
    )
  `);
});

// Function to add a blog post
function addPost(userId, title, content) {
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO posts (userId, title, content) VALUES (?, ?, ?)",
      [userId, title, content],
      function (err) {
        if (err) reject(err);
        else resolve(this.lastID); // Return the ID of the newly created post
      },
    );
  });
}

// Function to fetch all blog posts
function getPosts() {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM posts ORDER BY timestamp DESC", [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// Function to add a comment to a post
function addComment(postId, userId, comment) {
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO comments (postId, userId, comment) VALUES (?, ?, ?)",
      [postId, userId, comment],
      function (err) {
        if (err) reject(err);
        else resolve(this.lastID); // Return the ID of the newly created comment
      },
    );
  });
}

// Function to fetch comments for a specific post
function getComments(postId) {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT * FROM comments WHERE postId = ? ORDER BY timestamp ASC",
      [postId],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      },
    );
  });
}

module.exports = { addPost, getPosts, addComment, getComments };
