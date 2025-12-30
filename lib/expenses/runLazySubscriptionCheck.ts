import { collection, getDocs, updateDoc, doc, Timestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { addExpense } from "./addExpense";

export const runLazySubscriptionCheck = async (userId: string) => {
    const subsRef = collection(db, 'users', userId, 'subscriptionsDetails');
    const snap = await getDocs(subsRef);
    const now = new Date();

    for (const sub of snap.docs) {
        const data = sub.data();

        if (data.status !== 'active' || !data.lastUpdated) continue;

        let processingDate = data.lastUpdated.toDate();

        let nextBillingDate = new Date(processingDate);
        nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);


        let updatesMade = false;
        while (now >= nextBillingDate) {

            await addExpense({
                title: sub.id,
                amount: data.monthlyCost,
                type: "subscription",
                category: data.category || "General",
                expenseDate: nextBillingDate.toISOString(),
                subscription: {
                    frequency: "monthly",
                    startDate: nextBillingDate.toISOString(),
                    status: "active",
                    billingDay: nextBillingDate.getDate(),
                    billingMonth: nextBillingDate.getMonth() + 1,
                }
            }, userId);

            nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
            updatesMade = true;
        }


        if (updatesMade) {
            const newLastUpdated = new Date(nextBillingDate);
            newLastUpdated.setMonth(newLastUpdated.getMonth() - 1);

            await updateDoc(doc(subsRef, sub.id), {
                lastUpdated: Timestamp.fromDate(newLastUpdated)
            });
        }
    }
}