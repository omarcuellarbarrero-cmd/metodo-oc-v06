import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "metodooc-alumnos.firebaseapp.com",
  projectId: "metodooc-alumnos",
  storageBucket: "metodooc-alumnos.firebasestorage.app",
  messagingSenderId: "255525656537",
  appId: "1:255525656537:web:a8b35c75de615e889c6bc8"
};

const app = getApps().length
  ? getApps()[0]
  : initializeApp(firebaseConfig);

export const db = getFirestore(app);