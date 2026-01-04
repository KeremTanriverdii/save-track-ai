import { Timestamp } from "firebase-admin/firestore";
import admin from "../firebase/admin";
import { ReturnAPIResponseData } from "../types/type";

export const getExpenses = async (id: string, yearMonth?: string): Promise<ReturnAPIResponseData[]> => {
    if (id === null) {
        return []
    }
    const db = admin.firestore()
    try {
        const usersCollection = db.collection('users').doc(id);
        const expensesCollectionRef = db.collection('users').doc(id).collection('expenses')
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

            const querySnapshot = await expensesCollectionRef
                .where('date', '>=', startTimestamp)
                .where('date', '<', endTimestamp)
                .get()
            const data = querySnapshot.docs.map((doc) => {
                const rawData = doc.data();

                return {
                    ...rawData,
                    id: doc.id,

                    date: rawData.date?.toDate ? rawData.date.toDate() : new Date(),
                    createdAt: rawData.createdAt?.toDate ? rawData.createdAt.toDate() : new Date(),

                    subscriptionDetails: rawData.subscriptionDetails
                        ? {
                            ...rawData.subscriptionDetails,
                            startDate: rawData.subscriptionDetails.startDate?.toDate
                                ? rawData.subscriptionDetails.startDate.toDate()
                                : rawData.subscriptionDetails.startDate
                        }
                        : null
                };
            });
            return data as unknown as ReturnAPIResponseData[];
        } else {
            const querySnapshot = await expensesCollectionRef.get();
            const data = querySnapshot.docs.map((doc) => {
                const rawData = doc.data();

                return {
                    ...rawData,
                    id: doc.id,

                    date: rawData.date?.toDate ? rawData.date.toDate() : new Date(),
                    createdAt: rawData.createdAt?.toDate ? rawData.createdAt.toDate() : new Date(),

                    subscriptionDetails: rawData.subscriptionDetails
                        ? {
                            ...rawData.subscriptionDetails,
                            startDate: rawData.subscriptionDetails.startDate?.toDate
                                ? rawData.subscriptionDetails.startDate.toDate()
                                : rawData.subscriptionDetails.startDate
                        }
                        : null
                };
            });
            return data as unknown as ReturnAPIResponseData[];
        }
    } catch (err) {
        throw new Error('Error getting expenses' + err)
    }
}