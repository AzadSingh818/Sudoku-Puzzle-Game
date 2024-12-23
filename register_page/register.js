// Import required modules
const express = require('express');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const app = express();

// Body parser middleware to parse POST request data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://azadofficial16:mXsX1sYaO8fMhwBe@sudoku-game-db.dv4cd.mongodb.net/?retryWrites=true&w=majority&appName=sudoku-game-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Database connected...');
}).catch((err) => {
    console.error('Error connecting to the database:', err);
});

// Define the User Schema
const userSchema = new mongoose.Schema({
    fullname: { type: String, required: true },
    mobile: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    verification_token: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// Route for handling form submission
app.post('../register/register.html', async (req, res) => {
    let { fullname, mobile, email, username, password, confirm_password } = req.body;

    let fullname_err, mobile_err, email_err, username_err, password_err, confirm_password_err = '';
    let success_message = '';
    let error_message = '';

    // Validate Full Name
    if (!fullname) fullname_err = "Please enter your full name.";

    // Validate Mobile Number
    if (!mobile) mobile_err = "Please enter your mobile number.";

    // Validate Email Address
    if (!email) {
        email_err = "Please enter your email address.";
    } else if (!validateEmail(email)) {
        email_err = "Invalid email format.";
    }

    // Validate Username
    if (!username) username_err = "Please enter a username.";

    // Validate Password
    if (!password) password_err = "Please enter a password.";
    else if (password.length < 8) password_err = "Password must have at least 8 characters.";

    // Validate Confirm Password
    if (!confirm_password) confirm_password_err = "Please confirm password.";
    else if (password !== confirm_password) confirm_password_err = "Passwords did not match.";

    // Check for errors before proceeding
    if (!fullname_err && !mobile_err && !email_err && !username_err && !password_err && !confirm_password_err) {

        // Hash the password
        const hashedPassword = await hashPassword(password);

        try {
            // Check if mobile number already exists
            const existingUser = await User.findOne({ mobile });
            if (existingUser) {
                mobile_err = "This mobile number is already registered.";
                return res.status(400).send({ mobile_err });
            }

            // Check if email already exists
            const existingEmail = await User.findOne({ email });
            if (existingEmail) {
                email_err = "This email is already registered.";
                return res.status(400).send({ email_err });
            }

            // Check if username already exists
            const existingUsername = await User.findOne({ username });
            if (existingUsername) {
                username_err = "This username is already taken.";
                return res.status(400).send({ username_err });
            }

            // Generate a verification token
            const verification_token = crypto.randomBytes(16).toString('hex');

            // Create a new user and save to the database
            const newUser = new User({
                fullname,
                mobile,
                email,
                username,
                password: hashedPassword,
                verification_token
            });

            await newUser.save();

            // Send verification email
            sendVerificationEmail(email, fullname, verification_token, (error, info) => {
                if (error) {
                    error_message = "Error sending email: " + error;
                    return res.status(500).send(error_message);
                }

                success_message = 'Verification email has been sent. Please check your email.';
                res.status(200).send({ success_message });
            });

        } catch (err) {
            console.error(err);
            error_message = "Error registering user: " + err;
            res.status(500).send(error_message);
        }

    } else {
        return res.status(400).send({
            fullname_err,
            mobile_err,
            email_err,
            username_err,
            password_err,
            confirm_password_err
        });
    }
});

// Email validation function
function validateEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
}

// Password hashing function
async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}

// Send verification email using Nodemailer
function sendVerificationEmail(email, fullname, verification_token, callback) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'azad818n.s@gmail.com',  // Replace with your email
            pass: 'qcqs okhn hhbl mnkm'    // Replace with your email password
        }
    });

    const verificationLink = `http://localhost:3000/verify?token=${verification_token}`;

    const mailOptions = {
        from: 'azad818n.s@gmail.com',
        to: email,
        subject: 'Email Verification',
        html: `Hello ${fullname},<br><br>Click the following link to verify your email: <a href="${verificationLink}">${verificationLink}</a>`
    };

    transporter.sendMail(mailOptions, callback);
}

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
