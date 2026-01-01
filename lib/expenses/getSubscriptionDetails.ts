import { collection, getDocs } from "firebase/firestore"
import { db } from "../firebase/firebase"
import { ChartSubsDetails } from "../types/type";

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
            frequency: doc.data().frequency,
            title: doc.data().title
        })) as unknown as ChartSubsDetails[];

    } catch (err) {
        console.error("Error fetching subscription details:", err);
        throw new Error("Failed to fetch subscription details.");
    }
}
