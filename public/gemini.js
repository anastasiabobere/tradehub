// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCINWxOmLAwuzVIUrjuyceFmYTFO33buDM",
  authDomain: "tradehub-986b0.firebaseapp.com",
  databaseURL:
    "https://tradehub-986b0-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "tradehub-986b0",
  storageBucket: "tradehub-986b0.appspot.com",
  messagingSenderId: "209270213730",
  appId: "1:209270213730:web:b0dadb5a62ece7a8ce953b",
  measurementId: "G-97G3WHRM1P",
};
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();

function signInWithEmail() {
  const email = prompt("Enter your email:");
  const password = prompt("Enter your password:");

  if (email && password) {
    auth
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // User signed in successfully
        const user = userCredential.user;
        showPostForm();
        loadContent();
      })
      .catch((error) => {
        // Handle errors
        console.error(error);
        alert("Invalid email or password.");
      });
  } else {
    alert("Please enter both email and password.");
  }
}

function signInWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth
    .signInWithPopup(provider)
    .then((result) => {
      // User signed in successfully
      const user = result.user;
      showPostForm();
      loadContent();
    })
    .catch((error) => {
      // Handle errors
      console.error(error);
      alert("Google login failed.");
    });
}

function register() {
  const email = document.getElementById("reg-email").value;
  const password = document.getElementById("reg-password").value;
  const registrationMessage = document.getElementById("registration-message");

  if (email && password) {
    registrationMessage.textContent = "Creating account...";
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // User created successfully
        const user = userCredential.user;
        registrationMessage.textContent = "Registration successful!";
        showLoginForm(); // Show login form after successful registration
      })
      .catch((error) => {
        // Handle errors
        console.error(error);
        // Display a more user-friendly error message
        if (error.code === "auth/email-already-in-use") {
          registrationMessage.textContent = "Email address is already in use.";
        } else if (error.code === "auth/weak-password") {
          registrationMessage.textContent =
            "Password is too weak. Please use a stronger password.";
        } else {
          registrationMessage.textContent =
            "Registration failed. Please try again.";
        }
      });
  } else {
    registrationMessage.textContent = "Please enter both email and password.";
  }
}

function postContent() {
  const content = document.getElementById("post-content").value;
  const userId = auth.currentUser.uid;

  if (content) {
    const newPostRef = database.ref("posts").push();
    newPostRef
      .set({
        userId: userId,
        content: content,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
      })
      .then(() => {
        document.getElementById("post-content").value = "";
        showProfileButton();
        loadContent();
      })
      .catch((error) => {
        console.error(error);
        alert("Error posting content.");
      });
  } else {
    alert("Please enter some content!");
  }
}
function showProfileButton() {
  document.getElementById("profile-btn").style.display = "block";
}
function loadContent() {
  const contentArea = document.getElementById("content-area");
  contentArea.innerHTML = "";
  const postsRef = database.ref("posts");

  postsRef.on("value", (snapshot) => {
    try {
      snapshot.forEach((childSnapshot) => {
        const post = childSnapshot.val();
        const userRef = database.ref("users/" + post.userId);

        // Handle errors within the userRef.on() callback
        userRef.on("value", (userSnapshot) => {
          try {
            const userData = userSnapshot.val();
            const postElement = document.createElement("div");
            postElement.innerHTML = `
                <img src="${userData.profilePicture}" alt="Profile Picture" width="50" height="50">
                <strong>${userData.username}:</strong> ${post.content}
              `;
            contentArea.appendChild(postElement);
          } catch (error) {
            console.error("Error retrieving user data:", error);
          }
        });
      });
    } catch (error) {
      console.error("Error retrieving posts:", error);
    }
  });
}
function showLoginForm() {
  document.getElementById("login-form").style.display = "block";
  document.getElementById("register-form").style.display = "block";
  document.getElementById("post-form").style.display = "none";
}

function showPostForm() {
  document.getElementById("login-form").style.display = "none";
  document.getElementById("register-form").style.display = "none";
  document.getElementById("post-form").style.display = "block";
}

// Initial setup
showLoginForm();
