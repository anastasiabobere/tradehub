function loadPosts() {
  // Get f values
  const conditionFilter = document.getElementById("filterCondition").value;
  const locationFilter = document
    .getElementById("filterLocation")
    .value.toLowerCase();
  const postsContainer = document.getElementById("postsContainer");

  // Clear previous posts
  postsContainer.innerHTML = "";

  // Reference to the posts in the dsb
  const postsRef = firebase.database().ref("posts");

  // Load posts
  postsRef
    .once("value", (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const post = childSnapshot.val();
        const postId = childSnapshot.key;
        const currentUserId = firebase.auth().currentUser
          ? firebase.auth().currentUser.uid
          : null;

        // filter
        const matchesCondition =
          conditionFilter === "all" || post.condition === conditionFilter;
        const matchesLocation =
          locationFilter === "" ||
          post.location.toLowerCase().includes(locationFilter);

        // Show post if it matches the filters
        if (matchesCondition && matchesLocation) {
          const postElement = document.createElement("div");
          postElement.classList.add("product-card");

          postElement.innerHTML = `
            <img src="${post.imageUrl || "default-image.jpg"}" alt="${
            post.title
          }" /><br />
            <a href="product-details.html?postId=${postId}">${post.title}</a>
            <p>${post.location}<br />${post.description}</p>
          `;

          // Check if the current user is the author of the post
          if (currentUserId && post.userId === currentUserId) {
            postElement.innerHTML += `
              <button class="btn" onclick="editPost('${postId}')">Edit</button>
              <button class="btn" onclick="deletePost('${postId}')">Delete</button>
            `;
          }

          postsContainer.appendChild(postElement);
        }
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

function editPost(postId) {
  // Redirect to a post editing page or handle inline editing
  window.location.href = `edit-post.html?postId=${postId}`;
}

function deletePost(postId) {
  if (confirm("Are you sure you want to delete this post?")) {
    firebase
      .database()
      .ref("posts/" + postId)
      .remove()
      .then(() => {
        alert("Post deleted successfully.");
        loadPosts(); // Reload posts after deletion
      })
      .catch((error) => {
        console.error("Error deleting post:", error);
      });
  }
}

function loadUserPosts() {
  const userId = firebase.auth().currentUser.uid;
  const postsContainer = document.getElementById("userPostsContainer");

  postsContainer.innerHTML = ""; // Clear previous posts

  const postsRef = firebase
    .database()
    .ref("posts")
    .orderByChild("userId")
    .equalTo(userId);

  postsRef.once("value", (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      const post = childSnapshot.val();

      // Create post element and append it to the container
      const postElement = document.createElement("div");

      postElement.classList.add("product-card");
      postElement.innerHTML = `
        <img src="${
          post.imageUrl || "images/default-image.jpg"
        }" alt="Post Image" /><br />
        <a href="product-details.html?postId=${childSnapshot.key}">${
        post.title
      }</a>
        <p>${post.location}<br />${post.description}</p>
        <button class="btn" onclick="editPost('${
          childSnapshot.key
        }')">Edit</button>
        <button class="btn" onclick="deletePost('${
          childSnapshot.key
        }')">Delete</button>
      `;
      postsContainer.appendChild(postElement);
    });
  });
}

// Function to handle post editing
function editPost(postId) {
  // Redirect to an editing page with post ID in query params
  window.location.href = `edit-post.html?postId=${postId}`;
}

// Function to handle post deletion
function deletePost(postId) {
  if (confirm("Are you sure you want to delete this post?")) {
    firebase
      .database()
      .ref("posts/" + postId)
      .remove()
      .then(() => {
        alert("Post deleted successfully.");
        loadUserPosts(); // Reload posts after deletion
      })
      .catch((error) => {
        console.error("Error deleting post:", error);
      });
  }
}

// Load the user's posts when authenticated
auth.onAuthStateChanged((user) => {
  if (user) {
    loadUserPosts();
  }
});