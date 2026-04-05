import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAJ6o5AjdZhlRy8hj8oaHa3x7Eb2nNA0rE",
  authDomain: "auth.sametbasbug.dev",
  projectId: "blog-yorum-sistemi",
  storageBucket: "blog-yorum-sistemi.firebasestorage.app",
  messagingSenderId: "222950236607",
  appId: "1:222950236607:web:a454acaf18f9d9c7c6010a"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);