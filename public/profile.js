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

// Call loadUserData when the user is signed in
auth.onAuthStateChanged((user) => {
  if (user) {
    loadUserData();
  }
});
