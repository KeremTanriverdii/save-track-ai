import { doc, updateDoc, writeBatch } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { FormDataType } from "@/components/Client/OpenDialogClientComponent";

export const updateExpense = async (
    verifyUid: string,
    data: FormDataType,
    id: string,
    oldAmount: number,
    isSubscription: boolean
) => {
    const batch = writeBatch(db);
    const expenseDocRef = doc(db, 'users', verifyUid, 'expenses', id);
    const userDocRef = doc(db, 'users', verifyUid);

    const amountDiff = data.amount - oldAmount;


    batch.update(expenseDocRef, {
        amount: data.amount,
        category: data.category,
        description: data.description,
        title: data.title,
        date: data.date,
        ...(isSubscription ? { frequency: data.frequency } : { frequency: null })
    });

}