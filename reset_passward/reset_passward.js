const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

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

// Handle reset password request
app.get('/reset-password', (req, res) => {
    const { token } = req.query;

    if (token) {
        // Check if token exists in the database
        const checkTokenSql = 'SELECT * FROM users WHERE reset_token = ?';
        db.query(checkTokenSql, [token], (err, results) => {
            if (err) {
                console.error('Error checking token: ' + err);
                return res.status(500).send('Error checking token.');
            }

            if (results.length > 0) {
                // Token is valid, render reset password form
                return res.render('reset-password', { token });
            } else {
                // Invalid token
                return res.status(400).send('<script>alert("Invalid token.");</script>');
            }
        });
    } else {
        // Token not found
        return res.status(400).send('<script>alert("Token not found.");</script>');
    }
});

// Handle form submission for password reset
app.post('/reset-password', (req, res) => {
    const { token, new_password, confirm_password } = req.body;

    if (new_password === confirm_password) {
        // Check if token is valid
        const checkTokenSql = 'SELECT * FROM users WHERE reset_token = ?';
        db.query(checkTokenSql, [token], (err, results) => {
            if (err) {
                console.error('Error checking token: ' + err);
                return res.status(500).send('Error checking token.');
            }

            if (results.length > 0) {
                const user = results[0];
                const userId = user.id;

                // Hash the new password
                bcrypt.hash(new_password, 10, (err, hashedPassword) => {
                    if (err) {
                        console.error('Error hashing password: ' + err);
                        return res.status(500).send('Error hashing password.');
                    }

                    // Update password in the database
                    const updatePasswordSql = 'UPDATE users SET password = ?, reset_token = NULL WHERE id = ?';
                    db.query(updatePasswordSql, [hashedPassword, userId], (err, result) => {
                        if (err) {
                            console.error('Error updating password: ' + err);
                            return res.status(500).send('Error updating password.');
                        }

                        // Redirect to successful reset page
                        return res.redirect('/successful_reset_password');
                    });
                });
            } else {
                // Invalid token
                return res.status(400).send('<script>alert("Invalid token.");</script>');
            }
        });
    } else {
        // Passwords do not match
        return res.status(400).send('<script>alert("New password and confirm password do not match.");</script>');
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
