document.getElementById("imageInput").addEventListener("change", function (event) {
    const file = event.target.files[0];
    const preview = document.getElementById("preview");

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            preview.src = e.target.result;
            preview.classList.remove("hidden");
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById("classifyButton").addEventListener("click", function () {
    const fileInput = document.getElementById("imageInput");
    const resultDiv = document.getElementById("result");
    const classifyButton = document.getElementById("classifyButton");
    const loadingText = document.getElementById("loading");
    const valueAdditionDiv = document.getElementById("valueAddition");

    if (fileInput.files.length === 0) {
        resultDiv.innerHTML = "<p style='color: red;'>Please select an image.</p>";
        resultDiv.classList.remove("hidden");
        return;
    }

    const formData = new FormData();
    formData.append("image", fileInput.files[0]);

    classifyButton.disabled = true;
    loadingText.classList.remove("hidden");

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
            let ripenessClass = topPrediction.class;
            let confidence = (topPrediction.confidence * 100).toFixed(2);

            let resultHTML = `
                <h3 class="text-lg font-bold text-gray-700">Classification Results:</h3>
                <p><strong>Predicted Class:</strong> ${ripenessClass}</p>
                <p><strong>Confidence Level:</strong> ${confidence}%</p>
            `;

            if (data.results[0].all_predictions && typeof data.results[0].all_predictions === "object") {
                resultHTML += `<h4 class="font-semibold">All Predictions:</h4><ul>`;
                Object.entries(data.results[0].all_predictions).forEach(([cls, conf]) => {
                    resultHTML += `<li><strong>${cls}:</strong> ${(conf * 100).toFixed(2)}%</li>`;
                });
                resultHTML += `</ul>`;
            } else {
                console.warn("all_predictions is missing or not an object:", data.results[0].all_predictions);
                resultHTML += `<p style="color: orange;">No additional predictions available.</p>`;
            }

            resultDiv.innerHTML = resultHTML;
            resultDiv.classList.remove("hidden");

            // Fetch value addition methods based on ripeness level
            fetch(`http://127.0.0.1:8000/db/value-addition/?ripeness_stage=${ripenessClass}`)
            .then(response => response.json())
            .then(valueData => {
                console.log("Value addition methods received:", valueData);

                if (valueData.results && valueData.results.length > 0) {
                    let valueHTML = `
                        <h3 class="text-lg font-bold text-gray-700">Value Addition Methods for ${ripenessClass}</h3>
                        <div class="value-methods space-y-4">
                    `;

                    valueData.results.forEach(method => {
                        valueHTML += `
                            <div class="value-item p-4 bg-gray-100 rounded-lg shadow">
                                <h4 class="font-semibold text-green-700">${method.name}</h4>
                                <p>${method.description}</p>
                                <p><strong>Category:</strong> ${method.category}</p>
                                ${method.youtube_link ? `<a href="${method.youtube_link}" target="_blank" class="text-blue-500 hover:underline">Watch Guide</a>` : ""}
                            </div>
                        `;
                    });

                    valueHTML += "</div>";
                    valueAdditionDiv.innerHTML = valueHTML;
                    valueAdditionDiv.classList.remove("hidden");
                } else {
                    valueAdditionDiv.innerHTML = `<p>No value addition methods found for ${ripenessClass} bananas.</p>`;
                    valueAdditionDiv.classList.remove("hidden");
                }
            })
            .catch(error => {
                console.error("Error fetching value addition methods:", error);
                valueAdditionDiv.innerHTML = "<p style='color: red;'>Failed to fetch value addition methods.</p>";
                valueAdditionDiv.classList.remove("hidden");
            });

        } else {
            resultDiv.innerHTML = "<p style='color: red;'>No predictions received.</p>";
            resultDiv.classList.remove("hidden");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        resultDiv.innerHTML = "<p style='color: red;'>Failed to fetch results.</p>";
        resultDiv.classList.remove("hidden");
    })
    .finally(() => {
        classifyButton.disabled = false;
        loadingText.classList.add("hidden");
    });
});
