// setup materialize components
document.addEventListener("DOMContentLoaded", function () {
  var modals = document.querySelectorAll(".modal");
  M.Modal.init(modals);

  var items = document.querySelectorAll(".collapsible");
  M.Collapsible.init(items);
});
//скрипт что то там для ютуба не работает
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCINWxOmLAwuzVIUrjuyceFmYTFO33buDM",
  authDomain: "tradehub-986b0.firebaseapp.com",
  projectId: "tradehub-986b0",
  storageBucket: "tradehub-986b0.appspot.com",
  messagingSenderId: "209270213730",
  appId: "1:209270213730:web:b0dadb5a62ece7a8ce953b",
  measurementId: "G-97G3WHRM1P",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
