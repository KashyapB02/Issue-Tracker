import { auth } from "./firebase.js";
import { db } from './firebase.js'
import {
    createUserWithEmailAndPassword,
    updateProfile,
    sendEmailVerification,
    signInWithEmailAndPassword,
    signOut
} from 'https://www.gstatic.com/firebasejs/9.9.1/firebase-auth.js'
import {
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    doc,
    updateDoc,
    query,
    where
} from "https://www.gstatic.com/firebasejs/9.9.1/firebase-firestore.js";
import { successAlert, errorAlert, normalAlert } from "./alert.js";

const userCollectionRef = collection(db, 'users');

const signUpForm = document.getElementById("signUpForm");
const logInForm = document.getElementById("logInForm");
const logoutBtn = document.querySelectorAll("#logoutBtn");
const nameInput = document.getElementById("nameInput");

if (nameInput) {
    nameInput.oninput = function () {
        const lastInput = nameInput.value;
        const lastCharacter = lastInput.slice(-1);
    
        if (!((lastCharacter.charCodeAt() >= 65 && lastCharacter.charCodeAt() <= 90) ||
            (lastCharacter.charCodeAt() >= 97 && lastCharacter.charCodeAt() <= 122) ||
            (lastCharacter.charCodeAt() === 8) ||
            (lastCharacter.charCodeAt() === 32))) {
                nameInput.value = lastInput.slice(0, -1);
                errorAlert("Invalid character input.\nOnly Alphabets & spaces are allowed for name.");
            }
    }
}

const setUserInDb = (userId, userName) => {
    const user = {
        uid: userId,
        displayName: userName,
    }

    const q = query(userCollectionRef, where("uid", "==", userId));

    getDocs(q).then((snapshot) => {
        if (!snapshot.docs.length) {
            addDoc(userCollectionRef, user).then(() => {
                console.log("User Added Successfully!");
                window.location.replace("http://kashyap-issue-tracker.vercel.app/dashboard.html");
            }).catch((error) => {
                console.error(error.code);
            })
        } else {
            window.location.replace("http://kashyap-issue-tracker.vercel.app/dashboard.html");
        }
    }).catch((error) => {
        console.error(error.code);
    })
}

if (signUpForm) {
    signUpForm.onsubmit = function (e) {
        e.preventDefault();
    
        const email = signUpForm.emailInput.value;
        const password = signUpForm.passInput.value

        let mailFormate = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        if (!email.match(mailFormate)) {
            errorAlert("Invalid email address.\nPlease enter a valid email to create an account.");
            return;
        }

        if (password.length < 8) {
            errorAlert("Password must be atleast 8 characters long.");
            return;
        }
    
        createUserWithEmailAndPassword(auth, email, password).then((credential) => {
            const currentUser = auth.currentUser;

            sendEmailVerification(currentUser).then(() => {
                successAlert("Verification email sent.\nDon't forget to check your spam also.")
                const user = {
                    uid: currentUser.uid,
                    email: currentUser.email,
                    verified: false,
                }

                localStorage.setItem("user", JSON.stringify(user));
                signUpForm.reset();
            }).catch((error) => {
                console.error(error.message);
            })

            updateProfile(currentUser, {
                displayName: signUpForm.nameInput.value,
            }).then(() => {
                console.log(currentUser);
            }).catch((error) => {
                console.error(error.message);
            })
        }).catch((error) => {
            if (error.code === "auth/email-already-in-use") {
                normalAlert("Account with this email is already in use.\n Try logging in using this email or Create account using a different email.")
                signUpForm.reset();
            }
        })
    }
}

if (logInForm) {
    logInForm.onsubmit = function (e) {
        e.preventDefault();
    
        const email = logInForm.emailInput.value;
        const password = logInForm.passInput.value
    
        signInWithEmailAndPassword(auth, email, password).then((credential) => {
            const currentUser = credential.user

            if (currentUser.emailVerified) {
                const user = {
                    uid: currentUser.uid,
                    email: currentUser.email,
                    verified: true,
                    currentUser: currentUser,
                }

                localStorage.setItem("user", JSON.stringify(user));
                setUserInDb(currentUser.uid, currentUser.displayName);
            } else {
                errorAlert("User not verified.\n Please check your email for verification mail.")
                signOut(auth, currentUser)
                    .then(() => {
                        console.log("User Logged Out");
                    })
                    .catch((error) => {
                        console.error(error.message);
                    })
            }

            logInForm.reset();
        }).catch((error) => {
            console.error(error.code);
            switch(error.code) {
                case "auth/user-not-found": {
                    errorAlert("User not found.\nPlease recheck your entered email or Register first.");
                    break;
                }

                case "auth/wrong-password": {
                    errorAlert("Password Incorrect.\n Please enter password carefully.");
                    break;
                }
            }
        })
    }
}

for (let btns of logoutBtn) {
    btns.onclick = function () {
        var user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            signOut(auth, user.currentUser)
            .then(() => {
                console.log("User Logged Out");
                localStorage.clear();
                window.location.replace("http://kashyap-issue-tracker.vercel.app/auth/login.html")
            })
            .catch((error) => {
                console.error(error.message);
            })
        }
    }
}