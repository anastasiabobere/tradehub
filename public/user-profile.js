document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get("userId");

  if (!userId || /[.#$[\]]/.test(userId)) {
    console.error("Invalid or missing userId in URL.");

    console.log("sometnhing wrong at if state,emt");
    return; // Stop execution if userId is invalid
  }

  // Handle reporting user
  document.getElementById("reportUser").addEventListener("click", () => {
    window.location.href = "contact.html"; // Redirect to the contact us page for reporting
  });
  function startChat(receiverId) {
    // Generate a unique chat ID
    const chatId = [firebase.auth().currentUser.uid, receiverId]
      .sort()
      .join("_");

    // Redirect to chat page with chat ID
    window.location.href = `chat.html?chatId=${chatId}`;
  }

  const userRef = database.ref("users/" + userId);
  userRef
    .once("value")
    .then((snapshot) => {
      const userData = snapshot.val();

      if (userData) {
        document.getElementById("username-user").textContent =
          userData.username;
        document.getElementById("email").textContent = userData.email;
        loadUserPosts();
        if (userData.profilePicture) {
          document.getElementById("profile-picture").src =
            userData.profilePicture;
        } else {
          document.getElementById("profile-picture").src =
            "default-profile.jpg"; // Default image
        }

        document.getElementById("startChatButton").onclick = function () {
          startChat(userId);
        };
      } else {
        console.error("No user data found for userId:", userId);
        alert("User data not found.");
      }
    })
    .catch((error) => {
      console.error("Error loading user data:", error);
      alert("An error occurred while loading user data.");
    });
  function loadUserPosts() {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get("userId");
    const postsContainer = document.getElementById("otherUserPostsContainer");

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
           
          `;
        postsContainer.appendChild(postElement);
      });
    });
  }
});
