import { doc, getDoc } from "firebase/firestore"
import { db } from "../firebase"
import { Budget } from "../types/type";

export const calcRemaining = async (totalAmount: number): Promise<Budget> => {
    if (!totalAmount) throw new Error('Error totalAmount has no found');
    // Access budget collection
    const docRef = doc(db, 'users', 'testusers', 'budgets', 'kuKwYpRlicQQamEV7fYa');
    // access doc 
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) {
        console.log('adg')
    } else {
        const budged: number = docSnap.data().budgedId;
        const diff: number = budged - totalAmount;
        return { budged, diff }
    }
    throw new Error('Budget document not found');

}