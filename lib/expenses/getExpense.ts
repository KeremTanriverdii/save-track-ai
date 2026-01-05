import { Timestamp } from "firebase-admin/firestore";
import admin from "../firebase/admin";
import { ReturnAPIResponseData } from "../types/type";

export const getExpenses = async (id: string, yearMonth?: string): Promise<ReturnAPIResponseData[]> => {
    if (id === null) {
        return []
    }
    const db = admin.firestore()
    try {
        // const usersCollection = db.collection('users').doc(id);
        const expensesCollectionRef = db.collection('users').doc(id).collection('expenses')
        let query: admin.firestore.Query = expensesCollectionRef;
        if (yearMonth) {
            const [yearStr, monthStr] = yearMonth.split('-');
            const year = parseInt(yearStr);
            const monthIndex = parseInt(monthStr) - 1;

            const startDate = new Date(Date.UTC(year, monthIndex, 1));
            const endDate = new Date(Date.UTC(year, monthIndex + 1, 1));

            // Convert to timestap obj

            const startTimestamp = Timestamp.fromDate(startDate);
            const endTimestamp = Timestamp.fromDate(endDate);

            query = query
                .where('date', '>=', Timestamp.fromDate(startTimestamp.toDate()))
                .where('date', '<', Timestamp.fromDate(endTimestamp.toDate()));
        }
        const querySnapshot = await query.orderBy('date', 'desc').get();

        return querySnapshot.docs.map((doc) => {
            const rawData = doc.data();

            return {
                ...rawData,
                id: doc.id,
                date: rawData.date instanceof Timestamp
                    ? rawData.date.toDate().toISOString()
                    : rawData.date,

                createdAt: rawData.createdAt instanceof Timestamp
                    ? rawData.createdAt.toDate().toISOString()
                    : rawData.createdAt,

                subscriptionDetails: rawData.subscriptionDetails
                    ? {
                        ...rawData.subscriptionDetails,
                        startDate: rawData.subscriptionDetails.startDate instanceof Timestamp
                            ? rawData.subscriptionDetails.startDate.toDate().toISOString()
                            : rawData.subscriptionDetails.startDate
                    }
                    : null
            };
        }) as unknown as ReturnAPIResponseData[];

    } catch (err) {
        console.error("Firestore Error:", err);
        throw new Error('Error getting expenses: ' + err);
    }
}