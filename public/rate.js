document
  .getElementById("rateUsForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    // Get form values
    const interfaceRating = document.getElementById("interfaceRating").value;
    const functionalityRating = document.getElementById(
      "functionalityRating",
    ).value;
    const overallFeedback = document.getElementById("overallFeedback").value;
    const suggestions = document.getElementById("suggestions").value;

    // Save the data to Firebase Realtime Database
    firebase
      .database()
      .ref("feedback")
      .push({
        interfaceRating: interfaceRating,
        functionalityRating: functionalityRating,
        overallFeedback: overallFeedback,
        suggestions: suggestions,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
      })
      .then(() => {
        alert("Thank you for your feedback!");
        // Reset the form after submission
        document.getElementById("rateUsForm").reset();
      })
      .catch((error) => {
        console.error("Error saving feedback to Firebase:", error);
      });
  });

document
  .getElementById("downloadDataButton")
  .addEventListener("click", function () {
    const interfaceRating = document.getElementById("interfaceRating").value;
    const functionalityRating = document.getElementById(
      "functionalityRating",
    ).value;
    const overallFeedback = document.getElementById("overallFeedback").value;
    const suggestions = document.getElementById("suggestions").value;

    // Format the data as plain text
    const userData = `
      Interface Rating: ${interfaceRating}
      Functionality Rating: ${functionalityRating}
      Overall Feedback: ${overallFeedback}
      Suggestions: ${suggestions}
    `;

    // Create a downloadable text file using a data URL
    const dataStr =
      "data:text/plain;charset=utf-8," + encodeURIComponent(userData);

    // Create a download link and trigger the download
    const downloadLink = document.createElement("a");
    downloadLink.href = dataStr;
    downloadLink.download = "user_feedback.txt";
    downloadLink.click();
  });
