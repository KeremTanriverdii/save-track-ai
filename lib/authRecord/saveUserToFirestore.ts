"use server"

import { User } from "../types/type";
import admin from "../firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

export async function saveUserToFirestoreAction(user: User) {
    const userDataToUpdate = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || 'Anonymous User',
        photoURL: user.photoURL,
        lastLogin: admin.firestore.FieldValue.serverTimestamp(),
        currency: '$'
    };

    const db = admin.firestore();
    const userRef = db.collection('users').doc(user.uid);
    const userInfo = await userRef.get();

    if (!userInfo.exists) {
        await userRef.set({
            ...userDataToUpdate,
            createdAt: FieldValue.serverTimestamp(),
        });
        console.log(`New user created to firestore: ${user.email}`);
    } else {
        await userRef.update(userDataToUpdate);
        console.log(`User's data updated to firestore: ${user.email}`);
    }
}