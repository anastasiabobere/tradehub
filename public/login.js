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
const storage = firebase.storage();
//код чтобы зайти
auth.onAuthStateChanged((user) => {
  if (user) {
    // User is signed in, get their information
    const userId = user.uid;
    showProfileButton();
    hideLoginButton();
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
  } else {
    // User is signed out, redirect to login page
    window.location.href = "index.html";
  }
});
// логин емайл гугл
function signInWithEmail() {
  const email = prompt("Enter your email:");
  const password = prompt("Enter your password:");

  if (email && password) {
    auth
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // User signed in successfully
        const user = userCredential.user;

        // Redirect to profile page IMMEDIATELY
        window.location.href = "profile.html";
        showProfileButton();
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

      showSignOutButton();
      showProfileButton();
    })
    .catch((error) => {
      // Handle errors
      console.error(error);
      alert("Google login failed.");
    });
}

// чтобы выйти
function signOut() {
  auth
    .signOut()
    .then(() => {
      // Sign-out successful.
      console.log("Signed out successfully");
      // Redirect to the login page (or another page as needed)
      window.location.href = "index.html";
    })
    .catch((error) => {
      // An error happened.
      console.error("Error signing out:", error);
    });
}
// зарегаться
function register() {
  const email = document.getElementById("reg-email").value;
  const password = document.getElementById("reg-password").value;
  const username = document.getElementById("reg-username").value;
  const registrationMessage = document.getElementById("registration-message");

  if (email && password && username) {
    registrationMessage.textContent = "Creating account...";
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // User created successfully
        const user = userCredential.user;

        // Store username in Firebase Realtime Database
        const userId = user.uid;
        const userRef = database.ref("users/" + userId);
        userRef
          .set({
            username: username,
            email: email, // You can also store the email if needed
          })
          .then(() => {
            registrationMessage.textContent = "Registration successful!";
            window.location.href = "profile.html"; // Redirect to profile page
          })
          .catch((error) => {
            console.error("Error storing user data:", error);
            registrationMessage.textContent =
              "Error completing registration. Please try again.";
          });
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
    registrationMessage.textContent = "Please enter all fields.";
  }
}
// Для кнопок и чтоьы все видно было
function showProfileButton() {
  document.getElementById("profile-btn").style.display = "block";
}
function hideLoginButton() {
  document.getElementById("login-btn").style.display = "none";
}
function showSignOutButton() {
  document.getElementById("sign-out-btn").style.display = "block";
}
function showLoginForm() {
  document.getElementById("login-form").style.display = "block";
  document.getElementById("register-form").style.display = "block";
  document.getElementById("post-form").style.display = "none";
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

// Initial setup
showLoginForm();
