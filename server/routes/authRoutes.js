const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } = require('firebase/auth');
const app = require('../public/JSscript/firebase-config.js'); // Firebase config file
const auth = getAuth(app);

// User Registration
router.post('/register', async (req, res) => {
    const { fullName, mobile, email, username, password, confirmPassword } = req.body;

    // Validate all fields
    if (!fullName || !mobile || !email || !username || !password || !confirmPassword) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    // Validate password and confirm password match
    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Password and confirm password do not match.' });
    }

    try {
        // Check if the user already exists in the database (optional if using Firebase Auth)
        const userExists = await getUserByEmail(email); // Example function to check database
        if (userExists) {
            return res.status(400).json({ message: 'Email is already registered.' });
        }

        // Register the user with Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Optionally store additional user data in Firebase Realtime Database or Firestore
        const db = getFirestore(); // Get Firestore instance
        await setDoc(doc(db, "users", userCredential.user.uid), {
            fullName,
            mobile,
            email,
            username,
            uid: userCredential.user.uid,
            createdAt: new Date().toISOString(),
        });

        res.status(201).json({
            message: 'User registered successfully.',
            user: {
                uid: userCredential.user.uid,
                email: userCredential.user.email,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// User Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Validate input fields
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    try {
        // Query Firestore to get the email associated with the username
        const db = getFirestore(); // Get Firestore instance
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("username", "==", username));
        const querySnapshot = await getDocs(q);

        // If no user is found with the given username
        if (querySnapshot.empty) {
            return res.status(404).json({ message: 'Invalid username or password.' });
        }

        // Extract email from the first matching user
        const userDoc = querySnapshot.docs[0];
        const { email } = userDoc.data();

        // Authenticate using email and password with Firebase Authentication
        const userCredential = await signInWithEmailAndPassword(auth, email, password);

        res.status(200).json({
            message: 'User logged in successfully.',
            user: {
                uid: userCredential.user.uid,
                username,
                email: userCredential.user.email,
            },
        });
    } catch (error) {
        res.status(401).json({ message: 'Invalid username or password.' });
    }
});

// Password Reset
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Email is required.' });
    }

    try {
        await sendPasswordResetEmail(auth, email);
        res.status(200).json({ message: 'Password reset email sent successfully.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
