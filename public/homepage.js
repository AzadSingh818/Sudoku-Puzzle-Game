// Import Firebase modules needed for the app
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js"; // Import the function to initialize Firebase
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js"; // Import authentication functions
import { getFirestore, getDoc, doc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js"; // Import Firestore database functions
//import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
// Firebase configuration object containing project details
const firebaseConfig = {
    apiKey: "AIzaSyBy9wvJT3KYf8ckngzKOf30JUGZD5HMS1U", // Your Firebase API key
    authDomain: "login-form-9095d.firebaseapp.com", // Authentication domain for your project
    projectId: "login-form-9095d", // Firebase project ID
    storageBucket: "login-form-9095d.firebasestorage.app", // Cloud Storage bucket
    messagingSenderId: "260527389944", // Messaging sender ID
    appId: "1:260527389944:web:454f53fb2c46c75a224f0d" // App ID for the Firebase project
};

// Initialize Firebase app with the provided configuration
const app = initializeApp(firebaseConfig); // Initialize Firebase app
// Initialize Firebase authentication and Firestore database
const auth = getAuth(app); // Set up authentication service
const db = getFirestore(); // Set up Firestore database

// Monitor authentication state to check if a user is logged in
onAuthStateChanged(auth, (user) => { 
    if (user) { // Check if the user is authenticated
        const loggedInUserId = localStorage.getItem('loggedInUserId'); // Retrieve the logged-in user's ID from local storage

        if (loggedInUserId) { // Check if the user ID exists in local storage
            console.log("User is logged in:", user); // Log the authenticated user object (optional for debugging)

            // Redirect to profile.html if the user is logged in
            window.location.href = 'profile.html'; 
        } else {
            console.log("User ID not found in local storage"); // Log if no user ID is found in local storage
        }
    } else {
        console.log("No user is logged in"); // Log if no user is logged in
        window.location.href = 'index.html'; // Redirect to the login page if not authenticated
    }
});

// Logout functionality
const logoutButton = document.getElementById('logout'); // Get the logout button by ID

logoutButton.addEventListener('click', () => { // Add a click event listener to the logout button
    localStorage.removeItem('loggedInUserId'); // Remove the logged-in user's ID from local storage
    signOut(auth) // Sign out the user from Firebase authentication
        .then(() => { // Handle successful logout
            window.location.href = 'index.html'; // Redirect the user to the login page
        })
        .catch((error) => { // Handle errors during sign-out
            console.error('Error signing out:', error); // Log the error
        });
});
