import { ChartSubsDetails } from "../types/type";
import admin from "../firebase/admin";

export const getSubscriptionDetails = async (uid: string): Promise<ChartSubsDetails[] | null> => {
    if (!uid) return null

    try {
        const db = admin.firestore();
        const detailsRef = db.collection('users').doc(uid).collection('subscriptionDetails');
        const snapshot = await detailsRef.get();

        if (!snapshot.empty) {
            return snapshot.docs.map(doc => ({
                id: doc.id,
                totalPaidForThis: doc.data().totalPaidForThis,
                status: doc.data().status,
                category: doc.data().category,
                totalPeriodsProcessed: doc.data().totalPeriodsProcessed,
                currency: doc.data().currency,
                frequency: doc.data().frequency,
                title: doc.data().title
            }))
        } else {
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

        }
    } catch (error) {
        console.error("Error fetching subscription details:", error);
        return [];
    }
}
