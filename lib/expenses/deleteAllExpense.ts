"use server"

import { collection, doc, getDocs, writeBatch } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { getUserData } from "../auth/user";
import { redirect } from "next/navigation";

export const deleteAllExpense = async () => {
    const user = await getUserData();

    if (!user || !user.uid) {
        return { success: false, error: "Unauthorized access detected." };
    }

    if (typeof user.uid !== 'string' || user.uid.length < 10) {
        throw new Error("Invalid User ID");
    }

    const batch = writeBatch(db);
    const expensesCollectionRef = collection(db, 'users', user.uid, 'expenses');
    const querySnapshot = await getDocs(expensesCollectionRef);
    querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
    });

    const userRef = doc(db, 'users', user.uid);
    batch.update(userRef, {
        totalSpent: 0,
        totalSubscriptionSpent: 0,
        totalOneTimeSpent: 0,
        lastUpdated: new Date()
    });

    const subsRef = collection(db, 'users', user.uid, 'subscriptionsDetails');
    const subsQuerySnapshot = await getDocs(subsRef);
    subsQuerySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
    });
    await batch.commit();
    redirect('/dashboard/expenses')

}