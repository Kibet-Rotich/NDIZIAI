document.getElementById("imageInput").addEventListener("change", function (event) {
    const file = event.target.files[0];
    const preview = document.getElementById("preview");

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            preview.src = e.target.result;
            preview.style.display = "block";
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById("classifyButton").addEventListener("click", function () {
    const fileInput = document.getElementById("imageInput");
    const resultDiv = document.getElementById("result");
    const classifyButton = document.getElementById("classifyButton");
    const loadingText = document.getElementById("loading");

    if (fileInput.files.length === 0) {
        resultDiv.innerHTML = "<p style='color: red;'>Please select an image.</p>";
        return;
    }

    const formData = new FormData();
    formData.append("image", fileInput.files[0]);

    // Disable button and show loading text
    classifyButton.disabled = true;
    loadingText.style.display = "block";

    console.log("Sending request...");

    fetch("http://127.0.0.1:8000/api/classify/", {
        method: "POST",
        body: formData,
        mode: "cors"
    })
    .then(response => response.json())
    .then(data => {
        console.log("Response received:", data);
        
        if (data.results && data.results.length > 0) {
            let topPrediction = data.results[0].top_prediction;
            let allPredictions = data.results[0].all_predictions;

            let resultHTML = `<h3>Classification Results:</h3>`;
            resultHTML += `<p><strong>Predicted Class:</strong> ${topPrediction.class}</p>`;
            resultHTML += `<p><strong>Confidence Level:</strong> ${(topPrediction.confidence * 100).toFixed(2)}%</p>`;

            resultHTML += `<h4>All Predictions:</h4><ul>`;
            for (let [key, value] of Object.entries(allPredictions)) {
                resultHTML += `<li><strong>${key}:</strong> ${(value * 100).toFixed(2)}%</li>`;
            }
            resultHTML += `</ul>`;

            resultDiv.innerHTML = resultHTML;
        } else {
            resultDiv.innerHTML = "<p style='color: red;'>No predictions received.</p>";
        }
    })
    .catch(error => {
        console.error("Error:", error);
        resultDiv.innerHTML = "<p style='color: red;'>Failed to fetch results. Check console for errors.</p>";
    })
    .finally(() => {
        // Re-enable button and hide loading text
        classifyButton.disabled = false;
        loadingText.style.display = "none";
    });
});
