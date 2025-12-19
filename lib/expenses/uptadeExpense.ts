import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

export const updateExpense = async (verifyUid: string, id: string, amount: number, category: string, description: string, title?: string) => {
    if (!id && !amount && !category && !description) return

    const expenseDocRef = doc(db, 'users', verifyUid, 'expenses', id);
    await updateDoc(expenseDocRef, {
        amount: amount,
        category: category,
        description: description,
        title: title
    })

}