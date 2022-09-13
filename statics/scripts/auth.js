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
    query,
    where
} from "https://www.gstatic.com/firebasejs/9.9.1/firebase-firestore.js";
import { successAlert, errorAlert, normalAlert } from "./alert.js";

const userCollectionRef = collection(db, 'users');

const signUpForm = document.getElementById("signUpForm");
const logInForm = document.getElementById("logInForm");
const logoutBtn = document.querySelectorAll("#logoutBtn");
const nameInput = document.getElementById("nameInput");

const setUserInDb = (userId, userName) => {
    const user = {
        uid: userId,
        displayName: userName,
    }

    const q = query(userCollectionRef, where("uid", "==", userId));
    getDocs(q).then((snapshot) => {
        if (!snapshot.docs.length) {
            addDoc(userCollectionRef, user).then(() => {
                window.location.replace(`${window.location.origin}/dashboard.html`);
            }).catch((error) => {
                console.error(error.code);
            })
        } else {
            window.location.replace(`${window.location.origin}/dashboard.html`);
        }

        logInForm.reset();
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
                    verified: false,
                }

                localStorage.setItem("user", JSON.stringify(user));
                signUpForm.reset();
            }).catch((error) => {
                console.error(error.message);
            })

            updateProfile(currentUser, {
                displayName: signUpForm.nameInput.value,
            }).then(() => {}).catch((error) => {
                console.error(error.message);
            })
        }).catch((error) => {
            if (error.code === "auth/email-already-in-use") {
                normalAlert("Account with this email is already in use.\n Try logging in using this email or Create account using a different email.")
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
                    verified: true,
                    currentUser: currentUser,
                }

                localStorage.setItem("user", JSON.stringify(user));
                setUserInDb(currentUser.uid, currentUser.displayName);
            } else {
                normalAlert("User not verified.\n Please check your email for verification mail.")
                signOut(auth, currentUser).then(() => {}).catch((error) => {
                    console.error(error.message);
                })
            }
        }).catch((error) => {
            console.error(error.code);
            switch(error.code) {
                case "auth/user-not-found": {
                    errorAlert("Incorrect email or Password.\nPlease recheck your credentials or Register first.");
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
        const user = JSON.parse(localStorage.getItem("user"))
        signOut(auth, user.currentUser).then(() => {
            localStorage.clear();
            window.location.replace(`${window.location.origin}/auth/login.html`)
        }).catch((error) => {
            console.error(error.message);
        })
    }
}

if (nameInput) {
    nameInput.oninput = function () {
        if (!nameInput.value)
            return;

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