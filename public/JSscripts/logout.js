const express = require('express');
const session = require('express-session');

const app = express();

// Set up session middleware
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));

// Route to handle logout
app.get('/logout', (req, res) => {
    // Unset all session variables
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send("Error while destroying session");
        }

        // Redirect to login page after session is destroyed
        res.redirect('../login_page/login.html');
    });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
