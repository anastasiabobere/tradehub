document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const chatId = urlParams.get("chatId");

  if (!chatId) {
    console.error("Invalid or missing chatId in URL.");
    return;
  }

  const messagesRef = firebase.database().ref(`chats/${chatId}/messages`);

  // Function to get username from user ID
  function getUsername(userId, callback) {
    const userRef = firebase.database().ref(`users/${userId}`);
    userRef.once("value", (snapshot) => {
      const userData = snapshot.val();
      callback(userData.username);
    });
  }

  // Load messages
  messagesRef.on("child_added", (snapshot) => {
    const message = snapshot.val();
    getUsername(message.senderId, (username) => {
      const messageElement = document.createElement("div");
      messageElement.classList.add("message");
      messageElement.innerHTML = `<span class="sender">${username}:</span> ${message.message}`;
      document.getElementById("messages").appendChild(messageElement);
      document.getElementById("messages").scrollTop =
        document.getElementById("messages").scrollHeight; // Auto scroll to the bottom
    });
  });

  // Send message
  document.getElementById("sendMessage").addEventListener("click", () => {
    const messageInput = document.getElementById("messageInput");
    const messageText = messageInput.value.trim();
    if (messageText) {
      messagesRef
        .push({
          message: messageText,
          senderId: firebase.auth().currentUser.uid,
          timestamp: Date.now(),
        })
        .then(() => {
          console.log("Message sent successfully");
        })
        .catch((error) => {
          console.error("Error sending message:", error);
        });
      messageInput.value = ""; // Clear the input
    }
  });
});
