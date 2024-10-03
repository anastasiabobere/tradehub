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
// const storage = firebase.storage();

auth.onAuthStateChanged((user) => {
  if (user) {
    console.log("User is signed in");
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
    hideProfileButton();
    console.log("No user signed in");
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
function resetPassword() {
  console.log("clicked");
  document.getElementById("resetPassword").innerHTML = `
  <form id="resetPasswordForm">
  <input type="email" id="resetEmail" placeholder="Enter your email" required />
  <button type="submit">Reset Password</button>
</form>
<p id="resetMessage"></p>`;
  document
    .getElementById("resetPasswordForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      const email = document.getElementById("resetEmail").value;

      firebase
        .auth()
        .sendPasswordResetEmail(email)
        .then(() => {
          document.getElementById("resetMessage").textContent =
            "Password reset email sent!";
        })
        .catch((error) => {
          document.getElementById(
            "resetMessage",
          ).textContent = `Error: ${error.message}`;
        });
    });
}

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
function showProfileButton() {
  document.getElementById("account-btn").style.display = "block";
}
function hideProfileButton() {
  document.getElementById("account-btn").style.display = "none";
}
function hideLoginButton() {
  const loginButton = document.getElementById("login-btn");
  if (loginButton) {
    loginButton.classList.add("hidden");
    loginButton.style.display = "none";
    console.log("Login button hidden");
  } else {
    console.error("Login button not found");
  }
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
document
  .getElementById("contactForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    // Push the form data to Firebase Realtime Database
    const submissionsRef = firebase.database().ref("contactSubmissions");
    submissionsRef
      .push({
        name: name,
        email: email,
        message: message,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
      })
      .then(() => {
        alert("Submitted!");
        document.getElementById("contactForm").reset(); // Clear the form
      })
      .catch((error) => {
        console.error("Error submitting contact form:", error);
      });
  });
document
  .getElementById("downloadDataButton")
  .addEventListener("click", function () {
    // Get form values
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    // Format the data as plain text
    const userData = `
      Name: ${name}
      Email: ${email}
      Message: ${message}
    `;

    // Create a downloadable text file using a data URL
    const dataStr =
      "data:text/plain;charset=utf-8," + encodeURIComponent(userData);

    // Create a download link and trigger the download
    const downloadLink = document.createElement("a");
    downloadLink.href = dataStr;
    downloadLink.download = "contact_form_data.txt";
    downloadLink.click();
  });

// Initial setup
showLoginForm();
