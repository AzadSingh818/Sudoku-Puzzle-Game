import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js"; // Import the Firebase app initialization function
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js"; // Import Firebase authentication functions


// Firebase configuration object with project details
const firebaseConfig = {
    apiKey: "AIzaSyBy9wvJT3KYf8ckngzKOf30JUGZD5HMS1U", // Your API key
    authDomain: "login-form-9095d.firebaseapp.com", // Your authentication domain
    projectId: "login-form-9095d", // Your Firebase project ID
    storageBucket: "login-form-9095d.firebasestorage.app", // Your storage bucket
    messagingSenderId: "260527389944", // Your messaging sender ID
    appId: "1:260527389944:web:454f53fb2c46c75a224f0d" // Your app ID
};

// Initialize Firebase app with the provided configuration
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.languageCode = 'en';
const provider = new GoogleAuthProvider();

const user = auth.currentUser;

const googleSignIn = document.getElementById('googleSignInButton'); // Get the sign-up button by ID
googleSignIn.addEventListener('click', function () {
    signInWithPopup(auth, provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const user = result.user;
            console.log(user);
            window.location.href = 'profile.html'; // Redirect to index page on success
        }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
        
        });

})
