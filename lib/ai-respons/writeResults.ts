import { addDoc, collection, doc } from "firebase/firestore";
import { db } from "../firebase";

export const writeResults = async (data: any) => {
    try {
        const aiCoachingRef = collection(db, 'users', 'testusers', 'aiResults');
        const addDocRef = await addDoc(aiCoachingRef, {
            insight: data,
            createdAt: new Date()
        });
        return addDocRef;
    } catch (error) {
        console.error("Error writing AI results to Firestore:", error);
        throw error;
    }
}