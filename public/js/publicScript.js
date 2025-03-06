//script for front-end functions
document.addEventListener("DOMContentLoaded", function () {
  const menuButton = document.querySelector(".menu");
  const header = document.getElementById("nav-con");
  const close = document.querySelector(".close");
  menuButton.addEventListener("click", function () {
    header.classList.add("open");

    console.log("clicked");
  });
  close.addEventListener("click", function () {
    header.classList.remove("open");
  });
});

releasePointerCapture(pointerId);
import { auth } from "./firebaseUtils.js";

auth.onAuthStateChanged((user) => {
  const createPostSection = document.getElementById("createPost");
  if (user) {
    createPostSection.style.display = "block";
  } else {
    createPostSection.style.display = "none";
  }
});
