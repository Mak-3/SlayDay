import { initializeApp, getApps, getApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
  onAuthStateChanged,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyBsPh7M6wEtjAr92vRl0qiRbEY3ck3CoO4",
  authDomain: "slayday-3ab3e.firebaseapp.com",
  projectId: "slayday-3ab3e",
  storageBucket: "slayday-3ab3e.firebasestorage.app",
  messagingSenderId: "809634720109",
  appId: "1:809634720109:web:fe53d40e4808aedccf9264",
  measurementId: "G-6SJCW9SPN1",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (e) {
  const { getAuth } = require("firebase/auth");
  auth = getAuth(app);
}

export const db = getFirestore(app);
export const storage = getStorage(app);
export { auth };

export const listenForAuthChanges = (callback) => {
  return onAuthStateChanged(auth, (user) => {
    callback(user);
  });
};