// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBlKHCdVfQvMRKQf2B5UqaLfDkwm6T1apo",
  authDomain: "challo-ghume-fa22c.firebaseapp.com",
  projectId: "challo-ghume-fa22c",
  storageBucket: "challo-ghume-fa22c.appspot.com",
  messagingSenderId: "411994731743",
  appId: "1:411994731743:web:a02cec85eb6aa66ddbe56a",
  measurementId: "G-5KYMV9KZ2D",
  databaseURL : "https://my_database.firebaseio.com"
};

// Initialize Firebase
const firebase_app = initializeApp(firebaseConfig);

const auth = getAuth(firebase_app);
const database = getDatabase(firebase_app);

export default firebase_app