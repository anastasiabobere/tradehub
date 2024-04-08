// menu function
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
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
