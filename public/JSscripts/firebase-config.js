// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyC0p-G4VLRA8A9w48AqYbXw8E3hcOcIPDc",
  authDomain: "sudoku-game-24238.firebaseapp.com",
  databaseURL: "https://sudoku-game-24238-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "sudoku-game-24238",
  storageBucket: "sudoku-game-24238.firebasestorage.app",
  messagingSenderId: "642157886701",
  appId: "1:642157886701:web:bd774329263ba80f8ee0e4",
  measurementId: "G-K863NBHJD2"
};

const app = initializeApp(firebaseConfig);

export default app;


// import { initializeApp } from "firebase/app";
// import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

// // Initialize Firebase
// const firebaseConfig = {
//   apiKey: "AIzaSyC0p-G4VLRA8A9w48AqYbXw8E3hcOcIPDc",
//   authDomain: "sudoku-game-24238.firebaseapp.com",
//   projectId: "sudoku-game-24238",
//   storageBucket: "sudoku-game-24238.firebasestorage.app",
//   messagingSenderId: "642157886701",
//   appId: "1:642157886701:web:bd774329263ba80f8ee0e4"
// };

// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

// // Connect to Firestore Emulator
// if (window.location.hostname === "localhost") {
//   connectFirestoreEmulator(db, "localhost", 8080);
// }
