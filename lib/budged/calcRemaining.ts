import { doc, getDoc } from "firebase/firestore"
import { db } from "../firebase"
import { Budget } from "../types/type";

export const calcRemaining = async (totalAmount: number): Promise<string | Budget> => {
    if (!totalAmount) return 'You have no expenses or budgets for this month';
    // Access budget collection
    const docRef = doc(db, 'users', 'testusers', 'budgets', '2025-11');
    // access doc 
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) {
        console.log('adg')
    } else {
        const budget: number = docSnap.data().budget;
        const diff: number = budget - totalAmount;
        const error = !totalAmount ? 'You have no expenses or budgets for this month' : ''
        return { budget, diff, error }
    }
    throw new Error('Budget document not found');
}