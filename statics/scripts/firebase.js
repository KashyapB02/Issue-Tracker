import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-auth.js"

const firebaseConfig = {
    apiKey: "AIzaSyBxKKkdHnrJwmF2xLd0n4xvJLZiigf450Y",
    authDomain: "javascript-issue-tracker.firebaseapp.com",
    projectId: "javascript-issue-tracker",
    storageBucket: "javascript-issue-tracker.appspot.com",
    messagingSenderId: "737088544776",
    appId: "1:737088544776:web:824452d708139805bb71bd"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };