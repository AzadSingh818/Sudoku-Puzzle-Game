// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const session = require('express-session');

const app = express();

// Set up middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve static files like HTML, CSS, JS
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/yourdatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Failed to connect to MongoDB:', err);
});

// Define User schema and model
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// POST route for login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if user exists in the database
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).send('No user found');
        }

        // Verify the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            // Set session variable for user
            req.session.user_id = user._id;
            return res.redirect('/home'); // Redirect to home page
        } else {
            return res.status(401).send('Invalid password');
        }
    } catch (err) {
        console.error(err);
        return res.status(500).send('Server error');
    }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
