import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCjyCi5cC4zDJHYmMtBgXVH3W7Sk3bu-kM",
  authDomain: "coffee-and-code-ffd4f.firebaseapp.com",
  projectId: "coffee-and-code-ffd4f",
  storageBucket: "coffee-and-code-ffd4f.appspot.com",
  messagingSenderId: "327139807493",
  appId: "1:327139807493:web:1bbce0a244f5906b1276c",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);   // <— de volta ao getFirestore
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const storage = getStorage(app);
