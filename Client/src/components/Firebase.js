// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDwDpqS-1YwBPqN2gM6zjvODrCfD4W15Xg",
  authDomain: "dijitalspormedya-e789a.firebaseapp.com",
  projectId: "dijitalspormedya-e789a",
  storageBucket: "dijitalspormedya-e789a.appspot.com",
  messagingSenderId: "295751097467",
  appId: "1:295751097467:web:e612023ae79eeef9ad16de"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and export it
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export default app;
