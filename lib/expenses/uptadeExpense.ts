import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

export const updateExpense = async (id: string, amount: number, category: string, description: string) => {
    console.log("Update Lib", id, amount, category, description);
    if (!id && !amount && !category && !description) return

    const expenseDocRef = doc(db, 'users', 'testusers', 'expenses', id);
    console.log(id)
    await updateDoc(expenseDocRef, {
        amount: amount,
        category: category,
        description: description
    })

}