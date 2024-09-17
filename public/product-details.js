document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get("postId");

  if (!postId) {
    console.error("Invalid or missing postId in URL");
    return;
  }

  const postRef = firebase.database().ref("posts/" + postId);
  postRef
    .once("value", (snapshot) => {
      const postData = snapshot.val();
      if (!postData) {
        console.error("No post data found.");
        return;
      }

      // Display the post details
      document.getElementById("name").textContent = postData.title;
      document.getElementById("location").textContent = postData.location;
      document.getElementById("condition").textContent = postData.condition;
      document.getElementById("description").textContent = postData.description;
      document.getElementById("contact-info").textContent = postData.contact;
      document.getElementById("main").src = postData.imageUrl || "default.jpg";

      // Update the "View User Account" button with the correct userId
      const userId = postData.userId;
      if (userId) {
        const viewUserAccountButton = document.getElementById(
          "viewUserAccountButton",
        );
        viewUserAccountButton.href = `user-profile.html?userId=${userId}`;
      } else {
        console.error("No userId found for this post.");
      }
    })
    .catch((error) => {
      console.error("Error fetching post data:", error);
    });
});
