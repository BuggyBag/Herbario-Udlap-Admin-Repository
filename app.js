// Firebase Core
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-analytics.js";

// Firestore
import { 
    getFirestore, 
    collection, 
    addDoc, 
    getDocs, 
    deleteDoc, 
    doc, 
    query, 
    where 
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";


// YOUR EXACT CONFIG
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
getAnalytics(app);
const db = getFirestore(app);

let lastGeneratedId = null;

/* Navigation */
window.showSection = function(sectionId) {
    document.querySelectorAll('.container > div').forEach(div => div.classList.add('hidden'));
    document.getElementById(sectionId).classList.remove('hidden');

    if(sectionId === "view") loadRecords();
    if(sectionId === "edit") loadEditRecords();
};

window.goHome = function() {
    document.querySelectorAll('.container > div').forEach(div => div.classList.add('hidden'));
    document.getElementById('home').classList.remove('hidden');
};

/* ID Generator */
function generateHex() {
    const chars = "0123456789ABCDEF";
    let result = "";
    for (let i = 0; i < 8; i++) {
        result += chars[Math.floor(Math.random() * 16)];
    }
    return result;
}

window.generateId = async function() {

    if (lastGeneratedId) {
        await saveId(lastGeneratedId);
    }

    let newId;
    let exists = true;

    while (exists) {
        newId = "UDLAP:herbarium:" + generateHex();
        const q = query(collection(db, "occurrence_ids"), where("id", "==", newId));
        const snapshot = await getDocs(q);
        exists = !snapshot.empty;
    }

    document.getElementById("generatedId").value = newId;
    lastGeneratedId = newId;
    showNotification("generateNotification", "Unique ID generated", true);
};

async function saveId(id) {
    await addDoc(collection(db, "occurrence_ids"), { id: id });
}

window.addRegister = async function() {
    const id = document.getElementById("manualId").value.trim();
    if (!id) return;

    await saveId(id);
    showNotification("addNotification", "Saved successfully", true);
    document.getElementById("manualId").value = "";
};

async function loadRecords() {
    const table = document.getElementById("recordsTable");
    table.innerHTML = "";
    const snapshot = await getDocs(collection(db, "occurrence_ids"));

    snapshot.forEach(docSnap => {
        table.innerHTML += `<tr><td>${docSnap.data().id}</td></tr>`;
    });
}

async function loadEditRecords() {
    const table = document.getElementById("editTable");
    table.innerHTML = "";
    const snapshot = await getDocs(collection(db, "occurrence_ids"));

    snapshot.forEach(docSnap => {
        table.innerHTML += `
        <tr>
            <td>${docSnap.data().id}</td>
            <td><button onclick="deleteRecord('${docSnap.id}')">Delete</button></td>
        </tr>`;
    });
}

window.deleteRecord = async function(docId) {
    await deleteDoc(doc(db, "occurrence_ids", docId));
    loadEditRecords();
};

window.copyToClipboard = function() {
    const input = document.getElementById("generatedId");
    input.select();
    document.execCommand("copy");
    showNotification("generateNotification", "Copied to clipboard", true);
};

function showNotification(id, message, success) {
    const box = document.getElementById(id);
    box.innerText = message;
    box.className = "notification " + (success ? "success" : "error");
    box.style.display = "block";
    setTimeout(() => box.style.display = "none", 3000);
}
