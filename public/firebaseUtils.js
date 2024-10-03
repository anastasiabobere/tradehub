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
