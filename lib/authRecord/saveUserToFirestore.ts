import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore"
import { usersCollection } from "../firebase/firebase"
import { User } from "../types/type";

export const saveUserToFirestore = async (user: User) => {
    const userDataToUpdate = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || 'Anonim Kullanıcı',
        photoURL: user.photoURL,
        lastLogin: serverTimestamp(),
    };

    const userRef = doc(usersCollection, user.uid);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {

        await setDoc(userRef, {
            ...userDataToUpdate,
            createdAt: serverTimestamp(),
        });
        console.log(`Yeni kullanıcı Firestore'a kaydedildi: ${user.email}`);

    } else {
        await setDoc(userRef, userDataToUpdate, { merge: true });
        console.log(`Kullanıcı girişi güncellendi: ${user.email}`);
    }
}

