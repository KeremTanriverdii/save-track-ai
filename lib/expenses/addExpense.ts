import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { db } from "../firebase"

export const addExpense = async (data: any) => {
    console.log("Add Expense")
    const expensesCollectionRef = collection(db, 'users', 'testusers', 'expenses')

    const docRef = await addDoc(expensesCollectionRef, {
        amount: data.amount,
        category: data.category,
        description: data.description,
        createdAt: serverTimestamp(),
    })

}