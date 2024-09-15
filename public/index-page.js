function loadPosts() {
  const postsContainer = document.getElementById("postContainer");

  // Clear previous posts
  postsContainer.innerHTML = "";

  // Reference to the posts in the database
  const postsRef = firebase.database().ref("posts");

  // Load posts
  postsRef
    .once("value", (snapshot) => {
      const posts = [];

      snapshot.forEach((childSnapshot) => {
        const post = childSnapshot.val();
        const postId = childSnapshot.key;
        posts.push({ ...post, id: postId });
      });

      // Sort posts by timestamp (newest first)
      posts.sort((a, b) => b.timestamp - a.timestamp);

      // Display only the latest 3 posts
      const latestPosts = posts.slice(0, 3);
      latestPosts.forEach((post) => {
        const postElement = document.createElement("div");
        postElement.classList.add("product-card");

        postElement.innerHTML = `
          <img src="${post.imageUrl || "default-image.jpg"}" alt="${
          post.title
        }" /><br />
          <a href="product-details.html?postId=${post.id}">${post.title}</a>
          <p>${post.location}<br />${post.description}</p>
        `;

        postsContainer.appendChild(postElement);
      });
    })
    .catch((error) => {
      console.error("Error loading posts:", error);
    });
}

// Call loadPosts when the page loads
document.addEventListener("DOMContentLoaded", () => {
  loadPosts();
});
