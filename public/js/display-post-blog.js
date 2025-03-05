document.addEventListener("DOMContentLoaded", async () => {
  const blogContainer = document.getElementById("blog-posts");

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
            </div>
        `,
      )
      .join("");
  } catch (error) {
    console.error("Error loading blog posts:", error);
    blogContainer.innerHTML = "<p>Error loading posts.</p>";
  }
});
