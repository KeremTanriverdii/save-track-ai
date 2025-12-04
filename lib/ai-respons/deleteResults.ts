import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

export const deleteDataById = (id: string): Promise<void> => {
    if (!id) return Promise.reject("No id provided");

    const docRef = doc(db, "users", "testusers", "aiResults", id);
    return deleteDoc(docRef);
}