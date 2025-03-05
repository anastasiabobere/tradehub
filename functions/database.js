const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("blog.db");

// Create posts table if it doesn't exist
db.serialize(() => {
  db.run(`
        CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId TEXT NOT NULL,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
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
        else resolve();
      },
    );
  });
}

// Function to get all blog posts
function getPosts() {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM posts ORDER BY timestamp DESC", [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

module.exports = { addPost, getPosts };
