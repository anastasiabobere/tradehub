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
