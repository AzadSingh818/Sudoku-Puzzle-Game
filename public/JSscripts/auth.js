// Consolidated Imports
import { initializeApp } from "firebase/app";
import { 
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import { 
  getFirestore,
  doc,
  setDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import firebaseConfig from "./firebase-config.js"; // Import your Firebase configuration

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // Initialize Firestore

// Function to handle user registration
export const registerUser = async (fullName, mobile, email, username, password, confirmPassword) => {
  if (!fullName || !mobile || !email || !username || !password || !confirmPassword) {
    alert("All fields are required!");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await sendEmailVerification(user);

    // Save user data to Firestore
    const userDocRef = doc(db, "users", user.uid);
    await setDoc(userDocRef, {
      uid: user.uid,
      fullName,
      mobile,
      email,
      username,
      createdAt: serverTimestamp(),
    });

    alert("Registration successful! Please verify your email.");
  } catch (error) {
    console.error("Error during registration:", error);
    alert(error.message);
  }
};

// Function to handle user login
export const loginUser = async (username, password) => {
  if (!username || !password) {
    alert("Username and password are required!");
    return;
  }

  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      alert("Invalid username or password.");
      return;
    }

    const userDoc = querySnapshot.docs[0];
    const { email } = userDoc.data();

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (!user.emailVerified) {
      alert("Please verify your email before logging in.");
      await sendEmailVerification(user);
      return;
    }

    alert("Login successful!");
    window.location.href = "./public/profile.html";
  } catch (error) {
    console.error("Error during login:", error);
    alert("Invalid username or password.");
  }
};

// Function to handle password reset
export const resetPassword = async (email) => {
  if (!email) {
    alert("Email is required!");
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset email sent! Check your inbox.");
  } catch (error) {
    console.error("Error during password reset:", error);
    alert(error.message);
  }
};

// Function to log out the user
export const logoutUser = async () => {
  try {
    await signOut(auth);
    alert("Logout successful!");
    window.location.href = "../public/home.html";
  } catch (error) {
    console.error("Error during logout:", error);
    alert(error.message);
  }
};
