import { getApp, getApps, initializeApp } from "firebase/app";

import { getFirestore, collection } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, OAuthProvider } from "firebase/auth";

const clientCredentials = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = !getApps().length ? initializeApp(clientCredentials) : getApp();

export const auth = getAuth(app)
const db = getFirestore(app);
const storage = getStorage(app);

const usersCollection = collection(db, "users");
const commentsCollection = collection(db, "insights");
const budgetCollection = collection(db, "budgets");
const appleProvider = new OAuthProvider("apple.com")

export {
    app,
    db,
    storage,
    budgetCollection,
    commentsCollection,
    usersCollection,
    // googleprovider,
    appleProvider
};