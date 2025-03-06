document.addEventListener("DOMContentLoaded", async () => {
  const blogContainer = document.getElementById("posts");

  try {
    const response = await fetch(
      "http://localhost:5001/tradehub-986b0/us-central1/api/getPosts",
    );
    const posts = await response.json();

    if (posts.length === 0) {
      blogContainer.innerHTML = "<p>No blog posts yet.</p>";
      return;
    }

    blogContainer.innerHTML = posts
      .map(
        (post) => `
          <div class="post">
              <h2>${post.title}</h2>
              <p>${post.content}</p>
              <small>Posted on ${new Date(
                post.timestamp,
              ).toLocaleString()}</small>
              <div>
                  <input type="text" id="comment-${
                    post.id
                  }" placeholder="Add a comment">
                  <button onclick="addComment('${post.id}')">Comment</button>
              </div>
              <div id="comments-${post.id}"></div>
          </div>
      `,
      )
      .join("");
  } catch (error) {
    console.error("Error loading blog posts:", error);
    blogContainer.innerHTML = "<p>Error loading posts.</p>";
  }
});

// Function to add a comment
window.addComment = async (postId) => {
  const commentText = document.getElementById(`comment-${postId}`).value.trim();
  if (!commentText) return;

  try {
    const user = await checkAuth(); // Ensure the user is logged in
    const response = await fetch(
      "http://localhost:5001/tradehub-986b0/us-central1/api/addComment",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          userId: user.uid,
          comment: commentText,
        }),
      },
    );

    if (response.ok) {
      alert("Comment added successfully!");
      document.getElementById(`comment-${postId}`).value = ""; // Clear input
      window.location.reload(); // Refresh to show the new comment
    } else {
      alert("Error adding comment.");
    }
  } catch (error) {
    console.error("Error submitting comment:", error);
    alert("Failed to submit comment.");
  }
};
