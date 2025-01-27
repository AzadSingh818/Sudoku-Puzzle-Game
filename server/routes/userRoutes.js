const express = require('express');
const router = express.Router();
const { getAuth, onAuthStateChanged, updateProfile } = require('firebase/auth');
const app = require('../public/JSscript/firebase-config.js'); // Firebase config file
const auth = getAuth(app);

// Middleware to authenticate user
const authenticateUser = (req, res, next) => {
    const user = auth.currentUser;
    if (user) {
        req.user = user;
        next();
    } else {
        return res.status(401).json({ message: 'Unauthorized: Please log in first.' });
    }
};

// Get User Profile
router.get('/profile', authenticateUser, async (req, res) => {
    const user = req.user;
    res.status(200).json({
        message: 'User profile fetched successfully.',
        user: {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
        },
    });
});

// Update User Profile
router.post('/profile/update', authenticateUser, async (req, res) => {
    const { displayName, photoURL } = req.body;

    if (!displayName && !photoURL) {
        return res.status(400).json({ message: 'Provide at least one field to update.' });
    }

    try {
        await updateProfile(req.user, { displayName, photoURL });
        res.status(200).json({
            message: 'User profile updated successfully.',
            user: {
                uid: req.user.uid,
                email: req.user.email,
                displayName: displayName || req.user.displayName,
                photoURL: photoURL || req.user.photoURL,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Logout User
router.post('/logout', async (req, res) => {
    try {
        await auth.signOut();
        res.status(200).json({ message: 'User logged out successfully.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
