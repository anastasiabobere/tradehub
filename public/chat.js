document.addEventListener("DOMContentLoaded", function () {
  const currentUserId = firebase.auth().currentUser.uid;
  const urlParams = new URLSearchParams(window.location.search);
  const receiverId = urlParams.get("receiverId");

  const conversationId =
    currentUserId < receiverId
      ? `${currentUserId}_${receiverId}`
      : `${receiverId}_${currentUserId}`;

  const messagesRef = firebase.database().ref("chats/" + conversationId);

  // Load chat messages
  messagesRef.on("child_added", (snapshot) => {
    const message = snapshot.val();
    const messageElement = document.createElement("div");
    messageElement.textContent = `${
      message.senderId === currentUserId ? "You" : "Other"
    }: ${message.text}`;
    document.getElementById("chat-box").appendChild(messageElement);
  });

  // Send message
  document.getElementById("sendMessageButton").onclick = function () {
    const messageText = document.getElementById("messageInput").value;
    if (messageText.trim() !== "") {
      const newMessageRef = messagesRef.push();
      newMessageRef.set({
        senderId: currentUserId,
        text: messageText,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
      });
      document.getElementById("messageInput").value = ""; // Clear input
    }
  };
});
