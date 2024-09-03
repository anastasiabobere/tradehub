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
