document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get("postId");

  if (postId) {
    const postRef = firebase.database().ref("posts/" + postId);

    postRef
      .once("value")
      .then((snapshot) => {
        const post = snapshot.val();

        if (post) {
          document.getElementById("main").src =
            post.imageUrl || "default-image.jpg";
          document.getElementById("name").textContent = post.title;
          document.getElementById("location").textContent = post.location;
          document.getElementById("condition").textContent = post.condition;
          document.getElementById("description").textContent = post.description;
          document.getElementById("contact-info").textContent =
            post.contactInfo || "Contact info not provided";
        }
      })
      .catch((error) => {
        console.error("Error fetching post details:", error);
      });
  }
});
function viewUserProfile(userId) {
  window.location.href = `user-profile.html?userId=${userId}`;
}
