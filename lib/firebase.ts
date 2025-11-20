import { initializeApp } from "firebase/app";

import { getFirestore, collection } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { GoogleAuthProvider, OAuthProvider } from "firebase/auth";
import jsonFirebase from '../firebase.json'

const clientCredentials = {
    apiKey: jsonFirebase.apiKey,
    authDomain: jsonFirebase.authDomain,
    projectId: jsonFirebase.projectId,
    storageBucket: jsonFirebase.storageBucket,
    messagingSenderId: jsonFirebase.messagingSenderId,
    appId: jsonFirebase.appId,
    measurementId: jsonFirebase.measurementId
};

const app = initializeApp(clientCredentials);

const db = getFirestore(app);
const storage = getStorage(app);

const usersCollection = collection(db, "users");
const commentsCollection = collection(db, "insights");
const budgetCollection = collection(db, "budgets");
const googleprovider = new GoogleAuthProvider()
const appleProvider = new OAuthProvider("apple.com")

export {
    app,
    db,
    storage,
    budgetCollection,
    commentsCollection,
    usersCollection,
    googleprovider,
    appleProvider
};