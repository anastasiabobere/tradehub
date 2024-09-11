document
  .getElementById("createPostForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const location = document.getElementById("location").value;
    const condition = document.getElementById("condition").value;
    const fileInput = document.getElementById("postImage");
    const file = fileInput.files[0];
    const userId = firebase.auth().currentUser.uid;

    // Generate a unique key for the new post
    const postRef = firebase.database().ref("posts").push();

    // Upload image to Firebase Storage (if provided)
    if (file) {
      const storageRef = firebase.storage().ref();
      const fileRef = storageRef.child("postImages/" + postRef.key + ".jpg");

      fileRef
        .put(file)
        .then((snapshot) => {
          fileRef.getDownloadURL().then((url) => {
            // Save post data including the image URL
            savePostData(
              postRef.key,
              title,
              description,
              location,
              condition,
              url,
              userId,
            );
          });
        })
        .catch((error) => {
          console.error("Error uploading image:", error);
        });
    } else {
      // Save post data without an image
      savePostData(
        postRef.key,
        title,
        description,
        location,
        condition,
        null,
        userId,
      );
    }
  });

function savePostData(
  postId,
  title,
  description,
  location,
  condition,
  imageUrl,
  userId,
) {
  firebase
    .database()
    .ref("posts/" + postId)
    .set({
      title: title,
      description: description,
      location: location,
      condition: condition,
      imageUrl: imageUrl || null,
      userId: userId,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
    })
    .then(() => {
      alert("Post created successfully!");
      document.getElementById("createPostForm").reset();
    })
    .catch((error) => {
      console.error("Error creating post:", error);
    });
}
