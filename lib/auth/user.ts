import { cookies } from "next/headers";
import { User } from "../types/type";
import { redirect } from "next/navigation";
import admin from "../firebase/admin";

export async function getUserData(): Promise<User | undefined> {
    const cookieStore = cookies();
    const sessionCookie = ((await cookieStore).get)('session')?.value || undefined;

    if (!sessionCookie) {
        redirect('/auth/login');
    }

    try {
        const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie!, true);
        const userUid = decodedClaims.uid;

        const firestore = admin.firestore();
        const userDoc = await firestore.collection('users').doc(userUid).get();

        if (!userDoc.exists) {
            throw new Error('User not found');
        }
        const firestoreData = userDoc.data();

        const user: User = {
            uid: userUid,
            email: decodedClaims.email || '',
            photoURL: decodedClaims.picture || firestoreData?.photoURL || 'https://placehold.co/150x150/000000/FFFFFF?text=KU',
            displayName: decodedClaims.name || firestoreData?.displayName || 'Username',
            lastLogin: firestoreData?.lastLogin?.toDate().toISOString() || new Date().toISOString(),
            currency: firestoreData?.currency
        }

        return user
    } catch (error) {
        return undefined;
    }
}