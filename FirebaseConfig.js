// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth} from "firebase/auth";
// HERE YOU CAN IMPORT DATABASES etc. -Matias

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAJ1hzNXwjEz0DhluT2oK4cHi1uV_5b_C8",
  authDomain: "auth-test-filmproject.firebaseapp.com",
  projectId: "auth-test-filmproject",
  storageBucket: "auth-test-filmproject.appspot.com",
  messagingSenderId: "898051745759",
  appId: "1:898051745759:web:cd2e1272fdc4826f48066a"
};

// Initialize Firebase
// IF YOU IMPORT DBs HERE YOU INIT THEM AND EXPORT. -Matias
export const FIREBAE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBAE_APP);