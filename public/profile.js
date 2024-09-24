function loadUserData() {
  const userId = auth.currentUser.uid;
  const userRef = database.ref("users/" + userId);
  userRef.on("value", (snapshot) => {
    const userData = snapshot.val();
    if (userData) {
      document.getElementById("username").textContent = userData.username;
      document.getElementById("email").textContent = userData.email;
      if (userData.profilePicture) {
        document.getElementById("profile-picture").src =
          userData.profilePicture;
      }
    }
  });
}

auth.onAuthStateChanged((user) => {
  if (user) {
    loadUserData();

    const userId = user.uid;
    const chatsRef = firebase.database().ref("chats");

    chatsRef.once("value", (snapshot) => {
      const allChats = snapshot.val();
      if (!allChats) {
        console.log("No chats found.");
        return;
      }

      const chatListElement = document.getElementById("chatsList");

      Object.keys(allChats).forEach((chatId) => {
        const messages = allChats[chatId].messages;

        const lastMessage = Object.values(messages).pop();

        if (
          lastMessage &&
          (lastMessage.senderId === userId || chatId.includes(userId))
        ) {
          const participants = chatId.split("_");
          const otherUserId = participants.find(
            (participant) => participant !== userId,
          );

          const userRef = firebase.database().ref(`users/${otherUserId}`);
          userRef.once("value", (userSnapshot) => {
            const userData = userSnapshot.val();
            const username = userData.username || "Unknown User";

            const chatItem = document.createElement("div");
            chatItem.classList.add("chat-item");
            chatItem.innerHTML = `<a href="chat.html?chatId=${chatId}">Chat with ${username}</a>`;
            chatListElement.appendChild(chatItem);
          });
        }
      });
    });
  } else {
    console.log("User is not logged in.");
    // Optionally, redirect to login page if the user is not authenticated
    // window.location.href = "login.html";
  }
});
