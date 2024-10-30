// firebaseConfig.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBu0rKUQHmF2-cHAVxy7IOgV3F1ckCqN9k",
  authDomain: "marriage-registrations.firebaseapp.com",
  projectId: "marriage-registrations",
  storageBucket: "marriage-registrations.appspot.com",
  messagingSenderId: "844421685154",
  appId: "1:844421685154:web:f7487445341a0aef841cfb",
  measurementId: "G-5QPJYZECH8",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);
export { db, storage, auth };
