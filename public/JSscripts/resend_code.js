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
    user: 'root',        // Your DB username
    password: '',        // Your DB password
    database: 'your_database_name'  // Your DB name
});

// Connect to MySQL
db.connect((err) => {
    if (err) throw err;
    console.log('Database connected...');
});

// Handle password reset request
app.post('/reset-password-request', (req, res) => {
    const { email } = req.body;

    // Check if the email exists in the database
    const checkEmailSql = 'SELECT * FROM users WHERE email = ?';
    db.query(checkEmailSql, [email], (err, results) => {
        if (err) {
            console.error('Error checking email: ' + err);
            return res.status(500).send('Error checking email.');
        }

        if (results.length > 0) {
            // Generate a unique token (random 32-byte token)
            const token = crypto.randomBytes(32).toString('hex');

            // Store the token in the database
            const storeTokenSql = 'UPDATE users SET reset_token = ? WHERE email = ?';
            db.query(storeTokenSql, [token, email], (err, result) => {
                if (err) {
                    console.error('Error updating reset token: ' + err);
                    return res.status(500).send('Error updating reset token.');
                }

                // Send the reset password email
                sendResetEmail(email, token, (error, info) => {
                    if (error) {
                        console.error('Error sending email: ' + error);
                        return res.status(500).send('Error sending reset email.');
                    }

                    // Respond with success message
                    res.status(200).send('Password reset link sent to your email.');
                });
            });
        } else {
            // Email not found
            res.status(404).send('Email not found.');
        }
    });
});

// Function to send the password reset email using Nodemailer
function sendResetEmail(email, token, callback) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'your-email@gmail.com',  // Replace with your email
            pass: 'your-email-password'    // Replace with your email password
        }
    });

    const resetLink = `http://localhost:3000/reset-password?token=${token}`;

    const mailOptions = {
        from: 'your-email@gmail.com',
        to: email,
        subject: 'Password Reset Request',
        html: `<p>Click this link to reset your password:</p><p><a href="${resetLink}">${resetLink}</a></p>`
    };

    transporter.sendMail(mailOptions, callback);
}

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
