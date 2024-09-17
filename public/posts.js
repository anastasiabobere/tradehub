const postsRef = firebase.database().ref("posts");

postsRef.on("value", (snapshot) => {
  const postsContainer = document.getElementById("posts-container");
  postsContainer.innerHTML = ""; // Clear any existing posts

  snapshot.forEach((childSnapshot) => {
    const post = childSnapshot.val();
    const postId = childSnapshot.key;

    // Create a post element
    const postElement = document.createElement("div");
    postElement.innerHTML = `
            <h3>${post.title}</h3>
            <p>${post.description}</p>
            <p>Location: ${post.location}</p>
            <p>Condition: ${post.condition}</p>
            <p>Contact: ${post.contact}</p>
        `;

    // Get the current user's ID
    const currentUserId = firebase.auth().currentUser.uid;

    // Show "Edit" and "Delete" buttons only if the current user is the author
    if (post.userId === currentUserId) {
      postElement.innerHTML += `
                <button onclick="editPost('${postId}')">Edit</button>
                <button onclick="deletePost('${postId}')">Delete</button>
            `;
    }

    postsContainer.appendChild(postElement);
  });
});
