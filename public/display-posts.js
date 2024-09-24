function loadPosts() {
  const conditionFilter = document.getElementById("filterCondition").value;
  const locationFilter = document
    .getElementById("filterLocation")
    .value.toLowerCase();
  const postsContainer = document.getElementById("postsContainer");

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

          if (currentUserId && post.userId === currentUserId) {
            postElement.innerHTML += `
          <div class="buttons-post">
              <button class="btn" onclick="editPost('${postId}')">Edit</button>
              <button class="btn" onclick="deletePost('${postId}')">Delete</button></div>
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

document.addEventListener("DOMContentLoaded", () => {
  loadPosts();
});

function editPost(postId) {
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
        loadPosts();
      })
      .catch((error) => {
        console.error("Error deleting post:", error);
      });
  }
}
//current user posts
function loadUserPosts() {
  const userId = firebase.auth().currentUser.uid;
  const postsContainer = document.getElementById("userPostsContainer");

  postsContainer.innerHTML = "";

  const postsRef = firebase
    .database()
    .ref("posts")
    .orderByChild("userId")
    .equalTo(userId);

  postsRef.once("value", (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      const post = childSnapshot.val();

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
        <div class="buttons-post">
        <button class="btn" onclick="editPost('${
          childSnapshot.key
        }')">Edit</button>
        <button class="btn" onclick="deletePost('${
          childSnapshot.key
        }')">Delete</button>
        </div>
      `;
      postsContainer.appendChild(postElement);
    });
  });
}
// Load the user's posts when authenticated
auth.onAuthStateChanged((user) => {
  if (user) {
    loadUserPosts();
  }
});
