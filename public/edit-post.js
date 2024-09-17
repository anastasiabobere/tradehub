const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("postId");

// Function to load post data
function loadPostData() {
  const postRef = firebase.database().ref("posts/" + postId);
  postRef
    .once("value")
    .then((snapshot) => {
      const post = snapshot.val();
      if (post) {
        document.getElementById("title").value = post.title;
        document.getElementById("description").value = post.description;
        document.getElementById("location").value = post.location;
        document.getElementById("condition").value = post.condition;

        // If the post has an image, display it
        if (post.imageUrl) {
          const imgElement = document.createElement("img");
          imgElement.src = post.imageUrl;
          imgElement.alt = "Post Image";
          imgElement.width = 100;
          document.body.appendChild(imgElement);
        }
      } else {
        alert("Post not found");
      }
    })
    .catch((error) => {
      console.error("Error loading post data:", error);
    });
}

// Call the function to load post data on page load
loadPostData();
document
  .getElementById("editPostForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const location = document.getElementById("location").value;
    const condition = document.getElementById("condition").value;
    const contact = document.getElementById("contact-info").value;
    const fileInput = document.getElementById("postImage");
    const file = fileInput.files[0];

    // Function to update post data
    function updatePost(imageUrl) {
      const postRef = firebase.database().ref("posts/" + postId);
      postRef
        .update({
          title: title,
          description: description,
          location: location,
          condition: condition,
          contact: contact,
          imageUrl: imageUrl || null, // Update imageUrl if new image was uploaded
        })
        .then(() => {
          alert("Post updated successfully!");
          window.location.href = "products.html"; // Redirect to posts page
        })
        .catch((error) => {
          console.error("Error updating post:", error);
        });
    }

    // If a new image was uploaded, replace the old one
    if (file) {
      const storageRef = firebase.storage().ref();
      const fileRef = storageRef.child("postImages/" + postId + ".jpg");

      fileRef
        .put(file)
        .then((snapshot) => {
          fileRef.getDownloadURL().then((url) => {
            updatePost(url);
          });
        })
        .catch((error) => {
          console.error("Error uploading new image:", error);
        });
    } else {
      // Update post data without changing the image
      updatePost();
    }
  });
function deletePost(postId) {
  if (confirm("Are you sure you want to delete this post?")) {
    const postRef = firebase.database().ref("posts/" + postId);
    postRef
      .once("value")
      .then((snapshot) => {
        const post = snapshot.val();
        if (post && post.imageUrl) {
          // Delete the image from storage
          const storageRef = firebase.storage().refFromURL(post.imageUrl);
          storageRef
            .delete()
            .then(() => {
              console.log("Image deleted successfully");
            })
            .catch((error) => {
              console.error("Error deleting image:", error);
            });
        }
      })
      .then(() => {
        // Delete the post from the database
        postRef.remove().then(() => {
          alert("Post deleted successfully.");
          window.location.href = "posts.html"; // Redirect after deletion
        });
      })
      .catch((error) => {
        console.error("Error deleting post:", error);
      });
  }
}
