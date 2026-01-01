import { doc, getDoc, increment, serverTimestamp, updateDoc, writeBatch } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { FormDataType } from "@/components/Client/OpenDialogClientComponent";
import { ReturnAPIResponseData } from "../types/type";

export const updateExpense = async (
    verifyUid: string,
    data: FormDataType,
    id: string,
) => {
    if (!verifyUid || !id) {
        throw new Error("Missing Uid or Expense Id");
    }
    const batch = writeBatch(db);

    const expenseDocRef = doc(db, 'users', verifyUid, 'expenses', id);
    const userRef = doc(db, 'users', verifyUid);

    const snapshot = await getDoc(expenseDocRef);
    if (!snapshot.exists()) throw new Error('Expense not found');

    const oldData = snapshot.data();
    const oldAmount = oldData.amount;
    const amountDiff = (data.amount || 0) - oldAmount;

    batch.update(expenseDocRef, {
        amount: data.amount,
        title: data.title,
        description: data.description,
        category: data.category,
        date: typeof data.date === 'string' ? new Date(data.date) : data.date,
        updateAt: serverTimestamp()
    });

    if (amountDiff !== 0) {
        batch.update(userRef, {
            monthlyCost: increment(amountDiff),
            ...(oldData.type === 'subscription' && {
                totalSubscriptionSpent: increment(amountDiff)
            }),
            ...(oldData.type === 'one-time' && {
                totalOneTimeSpent: increment(amountDiff)
            })
        })
    }


    const subscriptionId = oldData.subscriptionId || data.title;

    if (oldData.type === 'subscription' && subscriptionId) {
        const subDetailRef = doc(db, 'users', verifyUid, 'subscriptionsDetails', subscriptionId);
        batch.update(subDetailRef, {
            monthlyCost: data.amount,
            status: data.status || 'active',
            frequency: data.frequency,
            lastUpdated: serverTimestamp()
        })
    }

    await batch.commit();
    return { success: true }
}