document.addEventListener("DOMContentLoaded", () => {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      const chatId = new URLSearchParams(window.location.search).get("chatId");
      if (!chatId) {
        console.error("Invalid or missing chatId in URL.");
        return;
      }

      // Retrieve messages ordered by timestamp
      const messagesRefForDisplay = firebase
        .database()
        .ref(`chats/${chatId}/messages`)
        .orderByChild("timestamp");
      // Use a regular reference for sending messages
      const messagesRefForSending = firebase
        .database()
        .ref(`chats/${chatId}/messages`);

      // Function to get username from user ID
      function getUsername(userId, callback) {
        const userRef = firebase.database().ref(`users/${userId}`);
        userRef.once("value", (snapshot) => {
          const userData = snapshot.val();
          callback(userData.username);
        });
      }
      function formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString(); // Customize the format if needed
      }

      // Load messages ordered by timestamp
      messagesRefForDisplay.on("child_added", (snapshot) => {
        const message = snapshot.val();
        getUsername(message.senderId, (username) => {
          const messageElement = document.createElement("div");
          messageElement.classList.add("message");
          const formattedTimestamp = formatTimestamp(message.timestamp);

          messageElement.innerHTML = `<span class="sender">${username}:</span> ${message.message} <span class="timestamp">(${formattedTimestamp})</span>`;
          document.getElementById("messages").appendChild(messageElement);

          // Auto scroll to the bottom after a new message is added
          document.getElementById("messages").scrollTop =
            document.getElementById("messages").scrollHeight;
        });
      });

      // Send message
      document.getElementById("sendMessage").addEventListener("click", () => {
        const messageInput = document.getElementById("messageInput");
        const messageText = messageInput.value.trim();
        if (messageText) {
          // Use the unfiltered messagesRef for sending
          messagesRefForSending
            .push({
              message: messageText,
              senderId: user.uid, // Use user.uid here
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
    } else {
      console.log("User is not logged in.");
    }
  });
});
