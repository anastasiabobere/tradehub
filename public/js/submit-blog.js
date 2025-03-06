import { checkAuth } from "./firebaseUtils.js";

document.getElementById("submitPost").addEventListener("click", async () => {
  const title = document.getElementById("postTitle").value.trim();
  const content = document.getElementById("postContent").value.trim();

  if (!title || !content) {
    alert("Title and content cannot be empty!");
    return;
  }

  try {
    const user = await checkAuth(); // Ensure the user is logged in
    const response = await fetch(
      "http://localhost:5001/tradehub-986b0/us-central1/api/addPost",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.uid, title, content }),
      },
    );

    if (response.ok) {
      alert("Post added successfully!");
      document.getElementById("postTitle").value = "";
      document.getElementById("postContent").value = "";
      window.location.reload(); // Refresh the page to show the new post
    } else {
      alert("Error adding post.");
    }
  } catch (error) {
    console.error("Error submitting post:", error);
    alert("Failed to submit post.");
  }
});
