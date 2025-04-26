// const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');

// // Import routes
// const registerRoutes = require('./register_page/register');


// const app = express();

// // Middleware
// app.use(bodyParser.json());

// // Connect to MongoDB
// mongoose.connect('#################################', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })
// .then(() => console.log('Connected to MongoDB'))
// .catch(err => console.log('Database connection error:', err));

// // Routes
// app.use('/register', registerRoutes); // Use register routes

// // Start the server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
