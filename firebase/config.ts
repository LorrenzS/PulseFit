import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey:
    process.env.EXPO_FIREBASE_API_KEY ??
    "AIzaSyBd6YYOaToKhci9xE7nKdqbhdqLwENAIKI",
  authDomain:
    process.env.EXPO_FIREBASE_AUTH_DOMAIN ?? "pulsefit-e0bef.firebaseapp.com",
  projectId: process.env.EXPO_FIREBASE_PROJECT_ID ?? "pulsefit-e0bef",
  storageBucket:
    process.env.EXPO_FIREBASE_STORAGE_BUCKET ??
    "pulsefit-e0bef.firebasestorage.app",
  messagingSenderId:
    process.env.EXPO_FIREBASE_MESSAGING_SENDER_ID ?? "70480145728",
  appId:
    process.env.EXPO_FIREBASE_APP_ID ??
    "1:70480145728:web:87bcbef77d4b143fa55ea5",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
