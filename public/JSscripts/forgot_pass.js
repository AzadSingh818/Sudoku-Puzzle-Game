const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'yourpassword',
    database: 'yourdatabase',
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected to the database.');
});

// POST: Password reset request
app.post('/request-password-reset', (req, res) => {
    const email = req.body.email;

    // Check if email exists in the database
    const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(checkEmailQuery, [email], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Email not found.' });
        }

        // Generate unique token
        const token = crypto.randomBytes(32).toString('hex');

        // Store token in the database
        const updateTokenQuery = 'UPDATE users SET reset_token = ? WHERE email = ?';
        db.query(updateTokenQuery, [token, email], async err => {
            if (err) {
                console.error('Error updating reset token:', err);
                return res.status(500).json({ message: 'Error updating reset token.' });
            }

            // Send reset link to user's email
            const resetLink = `http://localhost:3000/reset-password?token=${token}`;

            // Set up Nodemailer
            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false, // Use TLS
                auth: {
                    user: 'azad818n.s@gmail.com', // Your email
                    pass: 'btvt eyul yllm cbmp', // Your app password
                },
            });

            // Email options
            const mailOptions = {
                from: '"Your Name" <azad818n.s@gmail.com>',
                to: email,
                subject: 'Password Reset Link',
                html: `Click this link to reset your password: <a href="${resetLink}">${resetLink}</a>`,
            };

            try {
                await transporter.sendMail(mailOptions);
                res.json({ message: 'Password reset link sent to your email. Please check your email.' });
            } catch (error) {
                console.error('Error sending email:', error);
                res.status(500).json({ message: 'Error sending email. Please try again later.' });
            }
        });
    });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
