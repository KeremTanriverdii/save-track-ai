import { collection, getDocs } from "firebase/firestore"
import { db } from "../firebase/firebase"

export const getSubscriptionDetails = async (uid: string) => {
    if (!uid) return

    try {
        const detailsRef = collection(db, 'users', uid, 'subscriptionsDetails');
        const snapshot = await getDocs(detailsRef)
        return snapshot.docs.map(doc => ({
            id: doc.id,
            totalPaidForThis: doc.data().totalPaidForThis,
            status: doc.data().status,
            category: doc.data().category,
            totalPeriodsProcessed: doc.data().totalPeriodsProcessed,
            currency: doc.data().currency,
            frequency: doc.data().frequency
        })) as unknown as ChartSubsDetails[];

    } catch (err) {
        console.error("Error fetching subscription details:", err);
        throw new Error("Failed to fetch subscription details.");
    }
}

export interface ChartSubsDetails {
    id: string;
    totalPaidForThis: number;
    status: string;
    category: string[];
    totalPeriodsProcessed: number;
    currency: string;
    frequency: 'monthly' | 'yearly';
}