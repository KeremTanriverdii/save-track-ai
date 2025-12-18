import { collection, doc, getDocs, query, Timestamp, where } from "firebase/firestore"
import { db } from "../firebase/firebase"
import { Expense } from "../types/type";

export const getExpenses = async (id: string, yearMonth?: string): Promise<Expense[]> => {
    if (id === null) {
        return []
    }
    try {
        const usersCollection = doc(db, 'users', id);
        const expensesCollectionRef = collection(usersCollection, 'expenses')
        if (yearMonth) {
            const [yearStr, monthStr] = yearMonth.split('-');
            const year = parseInt(yearStr);
            const monthIndex = parseInt(monthStr) - 1;

            // Get first request month
            const startDate = new Date(year, monthIndex, 1)
            // Calculate other month timestap
            const endDate = new Date(year, monthIndex + 1, 1)

            // Convert to timestap obj
            const startTimestamp = Timestamp.fromDate(startDate);
            const endTimestamp = Timestamp.fromDate(endDate);

            const q = query(
                expensesCollectionRef,
                where('createdAt', '>=', startTimestamp),
                where('createdAt', '<', endTimestamp)
            )
            const querySnapshot = await getDocs(q)
            const data = querySnapshot.docs.map((doc) => ({
                ...(doc.data() as Expense),
                id: doc.id,// Ensure 'id' is correctly assigned from doc.id
            })) as Expense[];
            return data
        } else {
            const querySnapshot = await getDocs(expensesCollectionRef)
            const data = querySnapshot.docs.map((doc) => ({
                ...(doc.data() as Expense),
                id: doc.id,
            })) as Expense[];
            return data
        }
    } catch (err) {
        throw new Error('Error getting expenses' + err)
    }
}