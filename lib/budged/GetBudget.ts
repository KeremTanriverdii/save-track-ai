import admin, { db } from "../firebase/admin";
import { Budget } from "../types/type";
import { format, parse, subMonths } from "date-fns";

export const getBudget = async (id: string | null, yearMonth: string): Promise<Budget> => {
    if (!id || !yearMonth) {
        return { budget: 0, currency: '$', source: 'default' };
    }

    const docRef = db.collection('users').doc(id).collection('budgets').doc(yearMonth);

    try {
        const docSnap = await docRef.get();

        if (docSnap.exists) {
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

        const prevDocRef = db.collection('users').doc(id).collection('budgets').doc(prevMonthId);
        const prevSnapshot = await prevDocRef.get();

        if (prevSnapshot.exists) {
            const prevData = prevSnapshot.data() as Budget;

            const newBudgetData = {
                budget: prevData.budget,
                currency: prevData.currency || 'TRY',
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                isAutoCarried: true
            };

            await docRef.set(newBudgetData);

            return {
                ...newBudgetData,
                source: 'auto-carried'
            } as Budget;
        }

        return { budget: 0, currency: 'not chosen user profile', source: 'default' };

    } catch (error) {
        console.error(`Error fetching budget for ${yearMonth}:`, error);
        return { budget: 0, currency: '$', source: 'default' };
    }
};