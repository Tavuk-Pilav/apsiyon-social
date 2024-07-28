// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"; // Realtime Database için
import { getFirestore } from "firebase/firestore"; // Firestore için

const firebaseConfig = {
  apiKey: "AIzaSyCxD149xuAoZZJdBu9wq8ITK0yCs3K7i7E",
  authDomain: "apsiyonsocial.firebaseapp.com",
  databaseURL: "https://apsiyonsocial-default-rtdb.firebaseio.com",
  projectId: "apsiyonsocial",
  storageBucket: "apsiyonsocial.appspot.com",
  messagingSenderId: "918417977785",
  appId: "1:918417977785:android:5c9762a72698d95c724668",
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);

// Realtime Database veya Firestore'u al
const database = getDatabase(app); // Realtime Database için
// const firestore = getFirestore(app); // Firestore için

export { app, database }; // Veya export { app, firestore }; şeklinde