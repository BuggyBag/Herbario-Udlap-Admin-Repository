function showView(viewId) {
    document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
    document.getElementById(viewId).classList.add("active");
}

// --------------------
// Generate ID
// --------------------
async function generateId() {
    const response = await fetch("/generate", { method: "POST" });
    const data = await response.json();

    document.getElementById("generatedId").value = data.occurrence_id;
    setStatus("generateStatus", "New OccurrenceID generated.");
}

function copyId() {
    const input = document.getElementById("generatedId");
    if (!input.value) {
        setStatus("generateStatus", "Generate an ID first.", true);
        return;
    }

    navigator.clipboard.writeText(input.value);
    setStatus("generateStatus", "Copied to clipboard.");
}

// --------------------
// Add Register
// --------------------
async function addRegister() {
    const scientificName = document.getElementById("scientificName").value;
    const collector = document.getElementById("collector").value;
    const collectionDate = document.getElementById("collectionDate").value;

    const response = await fetch("/add-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            scientificName,
            collector,
            collectionDate
        })
    });

    const result = await response.json();
    setStatus("addStatus", result.message);
}

// --------------------
// Load Records
// --------------------
async function loadRecords() {
    const response = await fetch("/records");
    const data = await response.json();

    const tbody = document.querySelector("#recordsTable tbody");
    tbody.innerHTML = "";

    data.records.forEach(record => {
        const row = `
            <tr>
                <td>${record.id}</td>
                <td>${record.scientificName}</td>
                <td>${record.collector}</td>
                <td>${record.collectionDate}</td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// --------------------
// Status Helper
// --------------------
function setStatus(elementId, message, error=false) {
    const el = document.getElementById(elementId);
    el.style.color = error ? "red" : "green";
    el.textContent = message;

    setTimeout(() => {
        el.textContent = "";
    }, 3000);
}

<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyAUwRhm44SWGefJFxgEOk31vv5VGeKPGNA",
    authDomain: "projects-cges.firebaseapp.com",
    projectId: "projects-cges",
    storageBucket: "projects-cges.firebasestorage.app",
    messagingSenderId: "620255555114",
    appId: "1:620255555114:web:3726b649e8546f0e5f1d53",
    measurementId: "G-87EQPE9Z8B"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
</script>
