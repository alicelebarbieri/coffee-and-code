import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCjyCi5cC4zDJHYmMtBgXVH3W7Sk3bu-kM",
  authDomain: "coffee-and-code-ffdf4.firebaseapp.com",
  projectId: "coffee-and-code-ffdf4",
  storageBucket: "coffee-and-code-ffdf4.firebasestorage.app",
  messagingSenderId: "327139807493",
  appId: "1:327139807493:web:1bbce0a244f5906b1276c",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const provider = new GoogleAuthProvider();
