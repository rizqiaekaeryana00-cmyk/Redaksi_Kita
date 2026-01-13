import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Konfigurasi untuk project "redaksi-kita2"
const firebaseConfig = {
  apiKey: "AIzaSyD7-AScRPo5M72rFB5ENlJgI28hQpG9Ke0",
  authDomain: "redaksi-kita2.firebaseapp.com",
  projectId: "redaksi-kita2",
  storageBucket: "redaksi-kita2.firebasestorage.app",
  messagingSenderId: "507361334878",
  appId: "1:507361334878:web:175f589965807928ff86cf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);