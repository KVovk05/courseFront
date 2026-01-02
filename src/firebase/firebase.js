// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  getIdToken 
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBzFRXuqIjv65pHaLFRWllNv6RpolZKYKk",
  authDomain: "courseprojweb.firebaseapp.com",
  projectId: "courseprojweb",
  storageBucket: "courseprojweb.firebasestorage.app",
  messagingSenderId: "728689284671",
  appId: "1:728689284671:web:843c187e47b32e24f8ca8a",
  measurementId: "G-PM04CTY48T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (only in browser environment)
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export { analytics };
export {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  getIdToken
};
