const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();

// Middleware for parsing form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set up session management
app.use(session({
    secret: 'your-secret-key', // Use a secret key for signing session cookies
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set secure to true in production with HTTPS
}));

// Set up MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Your DB username
    password: '', // Your DB password
    database: 'your_database_name' // Your DB name
});

// Connect to MySQL
db.connect((err) => {
    if (err) throw err;
    console.log('Database connected...');
});

// Handle OTP verification request
app.post('/verify-otp', (req, res) => {
    const { otp } = req.body;

    // Check if OTP is stored in the session and matches the entered OTP
    if (otp === req.session.otp) {
        // OTP verified successfully
        res.send('<script>alert("OTP verified successfully. Login successful!"); window.location.href = "../home/home.html";</script>');
    } else {
        // Invalid OTP
        res.send('<script>alert("Invalid OTP. Please try again."); window.location.href = "verify_otp.js";</script>');
    }
});

// Simulate sending OTP (example route for setting OTP in session)
app.post('/send-otp', (req, res) => {
    const { contact } = req.body;

    // Generate OTP and store it in the session
    const otp = Math.floor(100000 + Math.random() * 900000); // Random 6-digit OTP
    req.session.otp = otp;

    // Example response to simulate sending OTP (e.g., via email or SMS)
    console.log(`OTP sent to ${contact}: ${otp}`);
    res.send('<script>alert("OTP has been sent to your contact."); window.location.href = "verify_otp.js";</script>');
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
