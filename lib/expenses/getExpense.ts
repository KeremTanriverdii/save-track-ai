import { collection, doc, getDocs, query, Timestamp, where } from "firebase/firestore"
import { db } from "../firebase/firebase"
import { ReturnAPIResponseData } from "../types/type";

export const getExpenses = async (id: string, yearMonth?: string): Promise<ReturnAPIResponseData[]> => {
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
                where('date', '>=', startTimestamp),
                where('date', '<', endTimestamp),
            )
            const querySnapshot = await getDocs(q)
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
            const querySnapshot = await getDocs(expensesCollectionRef)
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