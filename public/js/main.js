const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();
const storage = firebase.storage();

function signOut() {
  auth
    .signOut()
    .then(() => {
      console.log("Signed out successfully");
      window.location.href = "index.html";
    })
    .catch((error) => {
      console.error("Error signing out:", error);
    });
}

// document.addEventListener("DOMContentLoaded", () => {
//   const postsContainer = document.getElementById("posts");
//   const createPostSection = document.getElementById("createPost");

//   function loadPosts() {
//     fetch("http://localhost:3000/posts")
//       .then((res) => res.json())
//       .then((posts) => {
//         postsContainer.innerHTML = posts
//           .map(
//             (post) => `
//             <div>
//               <h2>${post.title}</h2>
//               <p>${post.content}</p>
//               <small>By User ID: ${post.user_id}</small>
//             </div>
//           `,
//           )
//           .join("");
//       })
//       .catch((err) => console.error("Error loading posts:", err));
//   }

//   firebase.auth().onAuthStateChanged((user) => {
//     if (user) {
//       createPostSection.style.display = "block";
//     } else {
//       createPostSection.style.display = "none";
//     }
//     loadPosts();
//   });

//   document.getElementById("submitPost").addEventListener("click", () => {
//     const user = firebase.auth().currentUser;
//     if (!user) return alert("You must be logged in!");

//     const title = document.getElementById("postTitle").value;
//     const content = document.getElementById("postContent").value;

//     fetch("http://localhost:3000/posts", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ title, content, user_id: user.uid }),
//     })
//       .then(() => {
//         document.getElementById("postTitle").value = "";
//         document.getElementById("postContent").value = "";
//         loadPosts();
//       })
//       .catch((err) => console.error("Error adding post:", err));
//   });
// });
