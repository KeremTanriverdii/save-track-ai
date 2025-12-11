import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

export const getDataAiResultById = async (verifyUid: string, id: string) => {
    // Get the firestore inside aiResults collection and inside with id document return the data
    const docRef = doc(db, "users", verifyUid, "aiResults", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        console.log("No such document!");
        return null;
    }



}