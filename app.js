const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Import routes
const registerRoutes = require('./register_page/register');


const app = express();

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://azadofficial16:mXsX1sYaO8fMhwBe@sudoku-game-db.dv4cd.mongodb.net/?retryWrites=true&w=majority&appName=sudoku-game-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.log('Database connection error:', err));

// Routes
app.use('/register', registerRoutes); // Use register routes

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
