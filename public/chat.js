document.addEventListener("DOMContentLoaded", () => {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      const chatId = new URLSearchParams(window.location.search).get("chatId");
      if (!chatId) {
        console.error("Invalid or missing chatId in URL.");
        return;
      }

      function formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString();
      }

      const messagesRefForDisplay = firebase
        .database()
        .ref(`chats/${chatId}/messages`)
        .orderByChild("timestamp");

      const messagesRefForSending = firebase
        .database()
        .ref(`chats/${chatId}/messages`);

      messagesRefForDisplay.on("child_added", (snapshot) => {
        const message = snapshot.val();
        const messageElement = document.createElement("div");
        messageElement.classList.add("message");
        if (message.senderId === user.uid) {
          messageElement.classList.add("currentUserMessage");
        } else {
          messageElement.classList.add("otherUserMessage");
        }
        document.getElementById("messages").appendChild(messageElement);
        getUsername(message.senderId, (username) => {
          const formattedTimestamp = formatTimestamp(message.timestamp);

          messageElement.innerHTML = `<span class="sender">${username}:</span> ${message.message} <span class="timestamp">(${formattedTimestamp})</span>`;

          document.getElementById("messages").scrollTop =
            document.getElementById("messages").scrollHeight;
        });
      });
      function getUsername(userId, callback) {
        const userRef = firebase.database().ref(`users/${userId}`);
        userRef.once("value", (snapshot) => {
          const userData = snapshot.val();
          callback(userData.username);
        });
      }

      // Send message
      document.getElementById("sendMessage").addEventListener("click", () => {
        const messageInput = document.getElementById("messageInput");
        const messageText = messageInput.value.trim();
        if (messageText) {
          messagesRefForSending
            .push({
              message: messageText,
              senderId: user.uid,
              timestamp: Date.now(),
            })
            .then(() => {
              console.log("Message sent successfully");
            })
            .catch((error) => {
              console.error("Error sending message:", error);
            });
          messageInput.value = "";
        }
      });
    } else {
      console.log("User is not logged in.");
    }
  });
});
