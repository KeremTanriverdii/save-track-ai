import { FormDataType } from "@/components/Client/OpenDialogClientComponent";
import admin from "../firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

export const updateExpense = async (
    verifyUid: string,
    data: FormDataType,
    id: string,
) => {
    if (!verifyUid || !id) {
        throw new Error("Missing Uid or Expense Id");
    }
    const db = admin.firestore()
    const batch = db.batch();

    const expenseDocRef = db.collection('users').doc(verifyUid).collection('expenses').doc(id);
    const userRef = db.collection('users').doc(verifyUid);

    const snapshot = await expenseDocRef.get();
    if (!snapshot.exists) throw new Error('Expense not found');

    const oldData = snapshot.data();
    const oldAmount = oldData?.amount;
    const amountDiff = (data.amount || 0) - oldAmount;

    batch.update(expenseDocRef, {
        amount: data.amount,
        title: data.title,
        description: data.description,
        category: data.category,
        date: typeof data.date === 'string' ? new Date(data.date) : data.date,
        updateAt: FieldValue.serverTimestamp()
    });

    if (amountDiff !== 0) {
        batch.update(userRef, {
            monthlyCost: FieldValue.increment(amountDiff),
            ...(oldData?.type === 'subscription' && {
                totalSubscriptionSpent: FieldValue.increment(amountDiff)
            }),
            ...(oldData?.type === 'one-time' && {
                totalOneTimeSpent: FieldValue.increment(amountDiff)
            })
        })
    }


    const subscriptionId = oldData?.subscriptionId || data.title;

    if (oldData?.type === 'subscription' && subscriptionId) {
        const subDetailRef = db.collection('users').doc(verifyUid).collection('subscriptionsDetails').doc(subscriptionId);
        batch.update(subDetailRef, {
            monthlyCost: data.amount,
            status: data.status || 'active',
            frequency: data.frequency,
            lastUpdated: FieldValue.serverTimestamp()
        })
    }

    await batch.commit();
    return { success: true }
}