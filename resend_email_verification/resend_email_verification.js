const express = require('express');
const mysql = require('mysql');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bodyParser = require('body-parser');

const app = express();

// Middleware for parsing form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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

// Handle email verification request
app.post('/verify-email-request', (req, res) => {
    const { email } = req.body;

    // Check if the email exists in the database
    const checkEmailSql = 'SELECT * FROM users WHERE email = ?';
    db.query(checkEmailSql, [email], (err, results) => {
        if (err) {
            console.error('Error checking email: ' + err);
            return res.status(500).send('Error checking email.');
        }

        if (results.length > 0) {
            // Generate a unique verification token (random 32-byte token)
            const token = crypto.randomBytes(32).toString('hex');

            // Store the token in the database
            const storeTokenSql = 'UPDATE users SET verification_token = ? WHERE email = ?';
            db.query(storeTokenSql, [token, email], (err, result) => {
                if (err) {
                    console.error('Error updating verification token: ' + err);
                    return res.status(500).send('Error updating verification token.');
                }

                // Send the verification email
                sendVerificationEmail(email, token, (error, info) => {
                    if (error) {
                        console.error('Error sending email: ' + error);
                        return res.status(500).send('Error sending verification email.');
                    }

                    // Respond with success message
                    res.status(200).send('Verification link sent to your email.');
                });
            });
        } else {
            // Email not found
            res.status(404).send('Email not found.');
        }
    });
});

// Function to send the verification email using Nodemailer
function sendVerificationEmail(email, token, callback) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'your-email@gmail.com', // Replace with your email
            pass: 'your-email-password' // Replace with your email password
        }
    });

    const verificationLink = `http://localhost:3000/verify-email?token=${token}`;

    const mailOptions = {
        from: 'your-email@gmail.com',
        to: email,
        subject: 'Email Verification',
        html: `<p>Click this link to verify your email:</p><p><a href="${verificationLink}">${verificationLink}</a></p>`
    };

    transporter.sendMail(mailOptions, callback);
}

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
