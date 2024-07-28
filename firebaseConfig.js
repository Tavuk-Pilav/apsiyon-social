// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"; // Realtime Database için
import { getFirestore } from "firebase/firestore"; // Firestore için

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);

// Realtime Database veya Firestore'u al
const database = getDatabase(app); // Realtime Database için
// const firestore = getFirestore(app); // Firestore için

export { app, database }; // Veya export { app, firestore }; şeklinde
