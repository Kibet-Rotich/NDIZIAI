const API_BASE = "http://127.0.0.1:8000";

const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("preview");
const previewCard = document.getElementById("previewCard");

const classifyButton = document.getElementById("classifyButton");
const resetButton = document.getElementById("resetButton");
const statusText = document.getElementById("statusText");

const resultCard = document.getElementById("resultCard");
const methodsCard = document.getElementById("methodsCard");
const emptyState = document.getElementById("emptyState");

const predictedClass = document.getElementById("predictedClass");
const confidenceValue = document.getElementById("confidenceValue");
const allPredictions = document.getElementById("allPredictions");
const methodsList = document.getElementById("methodsList");

let previewUrl = "";

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function titleCase(value) {
    return String(value)
        .replace(/[_-]/g, " ")
        .replace(/\b\w/g, (m) => m.toUpperCase());
}

function setStatus(message, tone) {
    statusText.textContent = message;
    statusText.classList.remove("warn", "good");
    if (tone) statusText.classList.add(tone);
}

function resetResults() {
    predictedClass.textContent = "-";
    confidenceValue.textContent = "0%";
    allPredictions.innerHTML = "";
    methodsList.innerHTML = "";
    resultCard.classList.add("is-hidden");
    methodsCard.classList.add("is-hidden");
    emptyState.classList.remove("is-hidden");
}

function clearPreview() {
    if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        previewUrl = "";
    }
    preview.removeAttribute("src");
    previewCard.classList.add("is-hidden");
}

function renderPredictions(topPrediction, predictionMap) {
    resultCard.classList.remove("is-hidden");
    emptyState.classList.add("is-hidden");

    const className = titleCase(topPrediction.class || "Unknown");
    const confidence = Number(topPrediction.confidence || 0);

    predictedClass.textContent = className;
    confidenceValue.textContent = `${(confidence * 100).toFixed(2)}%`;

    const entries = Object.entries(predictionMap || {});
    allPredictions.innerHTML = "";

    entries.forEach(([name, score]) => {
        const safeName = escapeHtml(titleCase(name));
        const safeScore = Number(score) || 0;
        const percent = Math.max(0, Math.min(100, safeScore * 100));

        const row = document.createElement("div");
        row.className = "bar-row";
        row.innerHTML = `
            <span class="bar-name">${safeName}</span>
            <div class="bar-track"><div class="bar-fill" style="width:${percent.toFixed(2)}%"></div></div>
            <span class="bar-value">${percent.toFixed(2)}%</span>
        `;
        allPredictions.appendChild(row);
    });
}

function renderMethods(methods, stage) {
    methodsCard.classList.remove("is-hidden");
    methodsList.innerHTML = "";

    if (!methods || methods.length === 0) {
        methodsList.innerHTML = `<p class="method-meta">No value-addition methods found for ${escapeHtml(titleCase(stage))} bananas yet.</p>`;
        return;
    }

    methods.forEach((method) => {
        const card = document.createElement("article");
        card.className = "method-item";

        const category = method.category ? titleCase(method.category) : "General";
        const description = method.description ? escapeHtml(method.description) : "No description available.";
        const title = escapeHtml(method.name || "Untitled Method");

        card.innerHTML = `
            <h4>${title}</h4>
            <p class="method-meta">Category: ${escapeHtml(category)}</p>
            <p class="method-desc">${description}</p>
        `;

        if (method.youtube_link) {
            const safeLink = escapeHtml(method.youtube_link);
            const anchor = document.createElement("a");
            anchor.className = "method-link";
            anchor.href = safeLink;
            anchor.target = "_blank";
            anchor.rel = "noopener noreferrer";
            anchor.textContent = "Open tutorial";
            card.appendChild(anchor);
        }

        methodsList.appendChild(card);
    });
}

imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];

    resetResults();
    if (!file) {
        clearPreview();
        setStatus("Ready for analysis.");
        return;
    }

    clearPreview();
    previewUrl = URL.createObjectURL(file);
    preview.src = previewUrl;
    previewCard.classList.remove("is-hidden");
    setStatus("Image loaded. Click Analyze Ripeness.", "good");
});

resetButton.addEventListener("click", () => {
    imageInput.value = "";
    clearPreview();
    resetResults();
    setStatus("Reset complete. Choose another image.");
});

classifyButton.addEventListener("click", async () => {
    const file = imageInput.files[0];

    if (!file) {
        setStatus("Please select an image first.", "warn");
        return;
    }

    classifyButton.disabled = true;
    setStatus("Classifying image. Please wait...");

    try {
        const formData = new FormData();
        formData.append("image", file);

        const classifyResponse = await fetch(`${API_BASE}/api/classify/`, {
            method: "POST",
            body: formData,
            mode: "cors"
        });

        const classifyData = await classifyResponse.json();
        const firstResult = classifyData?.results?.[0];

        if (!firstResult?.top_prediction) {
            throw new Error("No valid prediction returned.");
        }

        const topPrediction = firstResult.top_prediction;
        const allPredictionMap = firstResult.all_predictions || {};
        renderPredictions(topPrediction, allPredictionMap);

        const stage = topPrediction.class;
        setStatus(`Predicted ${titleCase(stage)}. Loading value-addition methods...`);

        const methodsResponse = await fetch(
            `${API_BASE}/db/value-addition/?ripeness_stage=${encodeURIComponent(stage)}`,
            { mode: "cors" }
        );
        const methodsData = await methodsResponse.json();

        renderMethods(methodsData?.results || [], stage);
        setStatus("Analysis complete.", "good");
    } catch (error) {
        console.error(error);
        resetResults();
        setStatus("Could not complete classification. Check backend server and try again.", "warn");
    } finally {
        classifyButton.disabled = false;
    }
});
