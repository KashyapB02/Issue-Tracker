import { auth } from "./firebase.js";
import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
    signInWithEmailAndPassword,
} from 'https://www.gstatic.com/firebasejs/9.9.1/firebase-auth.js'

const signUpForm = document.getElementById("signUpForm");
const logInForm = document.getElementById("logInForm");

if (signUpForm) {
    signUpForm.onsubmit = function (e) {
        e.preventDefault();
    
        const email = signUpForm.emailInput.value;
        const password = signUpForm.passInput.value
    
        createUserWithEmailAndPassword(auth, email, password).then((credential) => {
            const currentUser = auth.currentUser;

            sendEmailVerification(currentUser).then(() => {
                console.log("Verification Email Sent");
            }).catch((error) => {
                console.error(error.message);
            })

            console.log("User Signed Up");
            signUpForm.reset();
        }).catch((error) => {
            console.error(error.message);
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
            console.log("User Logged In: ", currentUser);
            logInForm.reset();
        }).catch((error) => {
            console.error(error.message);
        })
    }
}