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
function uploadProfilePicture() {
  const fileInput = document.getElementById("profile-picture-upload");
  const file = fileInput.files[0];

  if (file) {
    const storageRef = firebase.storage().ref();
    const fileRef = storageRef.child(
      "profilePictures/" + auth.currentUser.uid + ".jpg",
    );

    fileRef
      .put(file)
      .then((snapshot) => {
        fileRef
          .getDownloadURL()
          .then((url) => {
            const userId = auth.currentUser.uid;
            const userRef = database.ref("users/" + userId);
            userRef
              .update({
                profilePicture: url,
              })
              .then(() => {
                document.getElementById("profile-picture").src = url;
                alert("Profile picture updated!");
              })
              .catch((error) => {
                console.error("Error updating profile picture:", error);
              });
          })
          .catch((error) => {
            console.error("Error getting download URL:", error);
          });
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
      });
  } else {
    alert("Please select an image file.");
  }
}
