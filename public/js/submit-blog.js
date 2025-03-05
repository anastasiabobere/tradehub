document.getElementById("post-form").addEventListener("submit", async (e) => {
  e.preventDefault(); // Prevent page reload

  const title = document.getElementById("post-title").value.trim();
  const content = document.getElementById("post-content").value.trim();
  const userId = "testUser123"; // Replace with actual user authentication ID

  if (!title || !content) {
    alert("Title and content cannot be empty!");
    return;
  }

  try {
    const response = await fetch(
      "http://localhost:5001/tradehub-986b0/us-central1/api/addPost",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, title, content }),
      },
    );

    const result = await response.json();
    if (response.ok) {
      alert("Post added successfully!");
      document.getElementById("post-form").reset(); // Clear form
    } else {
      alert("Error: " + result.error);
    }
  } catch (error) {
    console.error("Error submitting post:", error);
    alert("Failed to submit post.");
  }
});
