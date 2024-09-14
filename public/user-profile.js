document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get("userId");

  if (!userId || /[.#$[\]]/.test(userId)) {
    console.error("Invalid or missing userId in URL.");

    console.log("sometnhing wrong at if state,emt");
    return; // Stop execution if userId is invalid
  }
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
        document.getElementById("username").textContent = userData.username;
        document.getElementById("email").textContent = userData.email;

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
});
