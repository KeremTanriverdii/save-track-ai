import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { usersCollection } from "../firebase/firebase";
import { Budged, Budget } from "../types/type";
import { format, parse, subMonths } from "date-fns";

export const getBudget = async (id: string | null, yearMonth: string): Promise<Budget> => {
    if (!id || !yearMonth) {
        return { budget: 0, currency: '$', source: 'default' };
    }

    const docRef = doc(usersCollection, id, 'budgets', yearMonth);

    try {
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data() as Budget;
            return {
                budget: data.budget ?? 0,
                currency: data.currency || '$',
                source: 'current'
            };
        }

        const currentDate = parse(yearMonth, 'yyyy-MM', new Date());
        const prevDate = subMonths(currentDate, 1);
        const prevMonthId = format(prevDate, 'yyyy-MM');

        const prevDocRef = doc(usersCollection, id, 'budgets', prevMonthId);
        const prevSnapshot = await getDoc(prevDocRef);

        if (prevSnapshot.exists()) {
            const prevData = prevSnapshot.data() as Budget;

            const newBudgetData = {
                budget: prevData.budget,
                currency: prevData.currency || 'TRY',
                createdAt: serverTimestamp(),
                isAutoCarried: true
            };

            await setDoc(docRef, newBudgetData);

            return {
                ...newBudgetData,
                source: 'auto-carried'
            };
        }

        return { budget: 0, currency: 'TRY', source: 'default' };

    } catch (error) {
        console.error(`Error fetching budget for ${yearMonth}:`, error);
        return { budget: 0, currency: 'TRY', source: 'default' };
    }
};