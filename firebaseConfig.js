import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";   
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBsPh7M6wEtjAr92vRl0qiRbEY3ck3CoO4",
  authDomain: "slayday-3ab3e.firebaseapp.com",
  projectId: "slayday-3ab3e",
  storageBucket: "slayday-3ab3e.firebasestorage.app",
  messagingSenderId: "809634720109",
  appId: "1:809634720109:web:fe53d40e4808aedccf9264",
  measurementId: "G-6SJCW9SPN1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export function listenForAuthChanges(callback) {
return onAuthStateChanged(auth, callback);
}