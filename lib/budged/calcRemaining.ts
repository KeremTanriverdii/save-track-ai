import { doc, getDoc } from "firebase/firestore"
import { db } from "../firebase/firebase"
import { Budget } from "../types/type";
import { dateCustom } from "@/utils/nowDate";

export const calcRemaining = async (verifyUid: string, totalAmount: number, date: string): Promise<Budget> => {
    if (!totalAmount) return { budget: 0, currency: 'No currency found', diff: 0, error: 'Error: An error occurred while calculating the remaining budget.' };
    // Access budget collection
    const docRef = doc(db, 'users', verifyUid, 'budgets', date);
    // access doc 
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) {
        console.log('error not exist')
    } else {
        const budget: number = docSnap.data().budget;
        const diff: number = budget - totalAmount;
        const error = !totalAmount ? 'You have no expenses or budgets for this month' : ''
        const currency: string = docSnap.data().currency
        return { budget, diff, error, currency }
    }
    throw new Error('Budget document not found');
}