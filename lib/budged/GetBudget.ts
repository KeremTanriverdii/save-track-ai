import { doc, getDoc } from "firebase/firestore";
import { usersCollection } from "../firebase/firebase";
import { Budget } from "../types/type";

export const getBudget = async (id: string | null, yearMonth: string): Promise<{ budget: number, currency: string } | string | number> => {
    if (!yearMonth) {
        return 'Error: YearMonth is required.';
    }
    const docRef = doc(usersCollection, id as string, 'budgets', yearMonth);
    const docSnap = await getDoc(docRef);

    // 4. Veri Check and Safety Return
    // If document not exist, we return 0 for the don't get error.
    if (!docSnap.exists()) {
        console.warn(`Warning: ${yearMonth} Not found in budgets collection.`);
        return 0;
    }

    // Open exist document
    const data = docSnap.data() as Budget;

    const budgetValue = (data?.budget) ?? 0;

    if (typeof budgetValue === 'number') {
        return { budget: budgetValue, currency: data?.currency || '$' };
    } else {
        console.error(`Error: ${yearMonth} format is not number.`);
        return 0;
    }
};