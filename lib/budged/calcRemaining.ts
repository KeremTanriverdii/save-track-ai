import { doc, getDoc } from "firebase/firestore"
import { db } from "../firebase"
import { Budget } from "../types/type";

export const calcRemaining = async (totalAmount: number): Promise<Budget> => {
    if (!totalAmount) throw new Error('Error totalAmount has no found');
    // Access budget collection
    const docRef = doc(db, 'users', 'testusers', 'budgets', '2025-11');
    // access doc 
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) {
        console.log('adg')
    } else {
        const budget: number = docSnap.data().budget;
        const diff: number = budget - totalAmount;
        return { budget, diff }
    }
    throw new Error('Budget document not found');

}