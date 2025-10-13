import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage, connectStorageEmulator } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyCjyCi5cC4zDJHYmMtBgXVH3W7Sk3bu-kM",
  authDomain: "coffee-and-code-ffdf4.firebaseapp.com",
  projectId: "coffee-and-code-ffdf4",
  storageBucket: "coffee-and-code-ffdf4.appspot.com",
  messagingSenderId: "327139807493",
  appId: "1:327139807493:web:1bbce0a244f5906b1276c",
  measurementId: "G-P0ZQ3SHK1T"

};

const app = initializeApp(firebaseConfig);


// Firebase SDK não tem função direta para configurar CORS no bucket,
// então o script abaixo usa a API REST da Google Cloud Storage.

import fetch from "node-fetch";

const CORS_CONFIG = [
  {
    origin: ["*"],
    method: ["GET", "POST", "PUT", "DELETE", "HEAD"],
    maxAgeSeconds: 3600,
  },
];

const projectId = "coffee-and-code-ffdf4";
const bucketName = "coffee-and-code-ffdf4.firebasestorage.app";

async function setCors() {
  console.log("Setting CORS for bucket:", bucketName);

  const metadataUrl = `https://storage.googleapis.com/storage/v1/b/${bucketName}`;

  // Pede token de acesso da conta atual (precisa estar logado com firebase login)
  const { execSync } = await import("child_process");
  const token = execSync('gcloud auth print-access-token').toString().trim();

  const res = await fetch(metadataUrl, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ cors: CORS_CONFIG }),
  });

  if (!res.ok) {
    console.error("❌ Failed to set CORS:", await res.text());
  } else {
    console.log("✅ CORS successfully set for:", bucketName);
  }
}

setCors().catch(console.error);


export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const storage = getStorage(app); 
export const googleProvider = new GoogleAuthProvider();