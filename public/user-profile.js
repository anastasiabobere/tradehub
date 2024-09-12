document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get("userId");

  if (!userId || /[.#$[\]]/.test(userId)) {
    console.error("Invalid or missing userId in URL.");
    alert("Invalid user ID. Cannot load profile.");
    return; // Stop execution if userId is invalid
  }

  const userRef = firebase.database().ref("users/" + userId);

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

function startChat(receiverId) {
  if (receiverId) {
    window.location.href = `chat.html?receiverId=${receiverId}`;
  } else {
    console.error("Invalid receiverId for starting chat.");
    alert("Cannot start chat due to invalid user ID.");
  }
}
