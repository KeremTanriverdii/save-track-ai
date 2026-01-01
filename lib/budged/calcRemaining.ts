import { RemainingResponse } from "../types/type";
import { getBudget } from "./GetBudget";

export const calcRemaining = async (verifyUid: string, totalAmount: number, date: string): Promise<RemainingResponse> => {
    if (!totalAmount) return { rCurrency: 'No currency found', rDiff: 0, rError: 'Error: An error occurred while calculating the remaining budget.' };
    // Access budget collection
    const docRef = await getBudget(verifyUid, date)
    // access doc 
    if (docRef.source === 'current' || docRef.source === 'auto-carried' || docRef.source === 'default') {
        const rBudget: number = docRef.budget
        const rDiff: number = rBudget - totalAmount
        const rError = !totalAmount ? 'You have no expenses or budgets for this month' : ''
        const rCurrency: string = docRef.currency
        return { rDiff, rError, rCurrency }
    } else {
        throw new Error('Budget document not found');
    }

}