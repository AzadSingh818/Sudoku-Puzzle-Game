// const mongoose = require('mongoose');

// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect('mongodb+srv://azadofficial16:mXsX1sYaO8fMhwBe@sudoku-game-db.dv4cd.mongodb.net/?retryWrites=true&w=majority&appName=sudoku-game-db', {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log(`MongoDB Connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.error(`Error: ${error.message}`);
//     process.exit(1); // Exit process with failure
//   }
// };

// module.exports = connectDB;


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC0p-G4VLRA8A9w48AqYbXw8E3hcOcIPDc",
  authDomain: "sudoku-game-24238.firebaseapp.com",
  projectId: "sudoku-game-24238",
  storageBucket: "sudoku-game-24238.firebasestorage.app",
  messagingSenderId: "642157886701",
  appId: "1:642157886701:web:bd774329263ba80f8ee0e4",
  measurementId: "G-K863NBHJD2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);