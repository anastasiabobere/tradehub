// const firebaseConfig = {
//   apiKey: "AIzaSyCINWxOmLAwuzVIUrjuyceFmYTFO33buDM",
//   authDomain: "tradehub-986b0.firebaseapp.com",
//   databaseURL:
//     "https://tradehub-986b0-default-rtdb.europe-west1.firebasedatabase.app",
//   projectId: "tradehub-986b0",
//   storageBucket: "tradehub-986b0.appspot.com",
//   messagingSenderId: "209270213730",
//   appId: "1:209270213730:web:b0dadb5a62ece7a8ce953b",
//   measurementId: "G-97G3WHRM1P",
// };
// const app = firebase.initializeApp(firebaseConfig);
// const auth = firebase.auth();
// const database = firebase.database();

// auth.onAuthStateChanged((user) => {
//   if (user) {
//     // User is signed in, get their information
//     const userId = user.uid;
//     const userRef = database.ref("users/" + userId);
//     userRef.on("value", (snapshot) => {
//       const userData = snapshot.val();
//       if (userData) {
//         document.getElementById("username").textContent = userData.username;
//         document.getElementById("email").textContent = userData.email;
//         if (userData.profilePicture) {
//           document.getElementById("profile-picture").src =
//             userData.profilePicture;
//         }
//       }
//     });
//   } else {
//     // User is signed out, redirect to login page
//     window.location.href = "index.html";
//   }
//   showProfileButton();
// });
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
function showProfileButton() {
  document.getElementById("profile-btn").style.display = "block";
}
