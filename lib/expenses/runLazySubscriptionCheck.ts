import { FieldValue } from "firebase-admin/firestore";
import admin from "../firebase/admin";
import { addExpense } from "./addExpense";

export const runLazySubscriptionCheck = async (userId: string) => {
    const db = admin.firestore();
    const subRef = db.collection('users').doc(userId).collection('subscriptionsDetails')
    // const subsRef = collection(db, 'users', userId, 'subscriptionsDetails');

    const snap = await subRef.get();
    const now = new Date();

    for (const sub of snap.docs) {
        const data = sub.data();

        if (data.status !== 'active' || !data.lastUpdated) continue;

        const processingDate = data.lastUpdated.toDate();

        const nextBillingDate = new Date(processingDate);
        nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);


        let updatesMade = false;
        while (now >= nextBillingDate) {

            await addExpense({
                title: data.title,
                subscriptionId: sub.id,
                type: "subscription",
                amount: data.amount || 0,
                category: data.category || "General",
                expenseDate: nextBillingDate.toISOString(),
                subscription: {
                    frequency: "monthly",
                    startDate: nextBillingDate.toISOString(),
                    status: "active",
                    billingDay: nextBillingDate.getDate(),
                    billingMonth: nextBillingDate.getMonth() + 1,
                },
            }, userId);

            nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
            updatesMade = true;
        }


        if (updatesMade) {
            const newLastUpdated = new Date(nextBillingDate);
            newLastUpdated.setMonth(newLastUpdated.getMonth() - 1);

            await subRef.doc(sub.id).update({
                lastUpdated: newLastUpdated
            })
        }
    }
}