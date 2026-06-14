// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCA8jr_ZBh8kJcgIz1Rpq402p_VZh8XKmM",
  authDomain: "hiking-app-e9e10.firebaseapp.com",
  projectId: "hiking-app-e9e10",
  storageBucket: "hiking-app-e9e10.firebasestorage.app",
  messagingSenderId: "292058959858",
  appId: "1:292058959858:web:2b4d06be41b4a159e9e56b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);