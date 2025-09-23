// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAe7Flv3GitDEjSdaKzpxcBkpkkj6prbOQ",
  authDomain: "cpre329.firebaseapp.com",
  projectId: "cpre329",
  storageBucket: "cpre329.firebasestorage.app",
  messagingSenderId: "253455817372",
  appId: "1:253455817372:web:26b0c1616fe582ce322b59",
  measurementId: "G-5KYMV9KZ2D",
  databaseURL: "https://my_database.firebaseio.com",
};

// Initialize Firebase
const firebase_app = initializeApp(firebaseConfig);

const auth = getAuth(firebase_app);
const database = getDatabase(firebase_app);

export default firebase_app;
