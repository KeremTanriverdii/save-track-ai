import { collection, doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore"
import { usersCollection } from "../firebase/firebase"
import { User } from "../types/type";

export const saveUserToFirestore = async (user: User) => {
    const userDataToUpdate = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || 'Anonymous User',
        photoURL: user.photoURL,
        lastLogin: serverTimestamp(),
        currency: 'TRY'
    };

    const userRef = doc(usersCollection, user.uid);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {

        await setDoc(userRef, {
            ...userDataToUpdate,
            createdAt: serverTimestamp(),
        });
        console.log(`New user created to firestore: ${user.email}`);

    } else {
        await setDoc(userRef, userDataToUpdate, { merge: true });
        console.log(`User's data updated to firestore: ${user.email}`);
    }
}

