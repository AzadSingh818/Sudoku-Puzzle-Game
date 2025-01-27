import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendEmailVerification
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBy9wvJT3KYf8ckngzKOf30JUGZD5HMS1U",
    authDomain: "login-form-9095d.firebaseapp.com",
    projectId: "login-form-9095d",
    storageBucket: "login-form-9095d.firebaseapp.com",
    messagingSenderId: "260527389944",
    appId: "1:260527389944:web:454f53fb2c46c75a224f0d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// Google Sign-In
document.getElementById('googleSignInButton').addEventListener('click', () => {
    signInWithPopup(auth, provider)
        .then(async (result) => {
            const user = result.user;

            // Save user data to Firestore
            const userData = {
                email: user.email,
                name: user.displayName,
                photoURL: user.photoURL,
            };

            await setDoc(doc(db, "users", user.uid), userData, { merge: true });

            // Redirect to profile page
            window.location.href = 'profile.html';
        })
        .catch((error) => {
            console.error("Google Sign-In Error:", error.message);
            alert(error.message);
        });
});

// Manual Sign-Up
document.getElementById('submitSignUp').addEventListener('click', async (e) => {
    e.preventDefault();
    const email = document.getElementById('rEmail').value;
    const password = document.getElementById('rPassword').value;
    const firstName = document.getElementById('fName').value;
    const lastName = document.getElementById('lName').value;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Send email verification
        await sendEmailVerification(user);

        // Save user data to Firestore
        const userData = {
            email,
            name: `${firstName} ${lastName}`,
        };

        await setDoc(doc(db, "users", user.uid), userData);

        alert('Account created successfully! Please verify your email.');
        window.location.href = 'Register & Login.html';
    } catch (error) {
        console.error("Sign-Up Error:", error.message);
        alert(error.message);
    }
});


// Manual Sign-In
document.getElementById('submitSignIn').addEventListener('click', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        alert('Login successful!');
        window.location.href = 'profile.html';
    } catch (error) {
        console.error("Sign-In Error:", error.message);
        alert(error.message);
    }
});
