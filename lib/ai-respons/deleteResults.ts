import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebase";

export const deleteDataById = (verifyUid: string, id: string): Promise<void> => {
    if (!id) return Promise.reject("No id provided");

    const docRef = doc(db, "users", verifyUid, "aiResults", id);
    return deleteDoc(docRef);
}