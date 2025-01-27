const express = require('express');
const session = require('express-session');
const nodemailer = require('nodemailer');
const Textlocal = require('textlocal');
const app = express();

// Set up body parser for form submissions
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set up session middleware
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));

// POST request to handle OTP generation
app.post('/request_otp', (req, res) => {
    const contact = req.body.contact;

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);  // Generates a 6-digit OTP

    // Store OTP and contact in session for simplicity
    req.session.otp = otp;
    req.session.contact = contact;

    // Determine if contact is email or mobile and send OTP
    if (validateEmail(contact)) {
        sendEmail(contact, otp, res);
    } else {
        sendSMS(contact, otp, res);
    }
});

// Email Validation Function
function validateEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
}

// Send OTP to email
function sendEmail(emailAddress, otp, res) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'azad818n.s@gmail.com',  // Replace with your email
            pass: 'cczb ysoz tzxz gdxg'  // Replace with your email password
        }
    });

    let mailOptions = {
        from: 'azad818n.s@gmail.com',
        to: emailAddress,
        subject: 'Your OTP Code',
        html: `<p>Your OTP code is: <strong>${otp}</strong></p>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send(`Failed to send email: ${error.message}`);
        } else {
            console.log('OTP email sent: ' + info.response);
            res.send('OTP code has been sent to your email.');
        }
    });
}

// Send OTP to mobile number using Textlocal API
function sendSMS(mobileNumber, otp, res) {
    const API_KEY = 'your_textlocal_api_key'; // Add your API key here

    const textlocal = new Textlocal(false, false, API_KEY);

    const numbers = [mobileNumber];
    const sender = 'TXTLCL';
    const message = `Your OTP code is: ${otp}`;

    textlocal.sendSms(numbers, message, sender, (error, response) => {
        if (error) {
            return res.status(500).send(`Failed to send SMS: ${error.message}`);
        } else {
            console.log('OTP SMS sent:', response);
            res.send('OTP code has been sent to your mobile number.');
        }
    });
}

// Starting the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
