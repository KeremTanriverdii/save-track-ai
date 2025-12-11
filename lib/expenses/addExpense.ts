import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { db } from "../firebase/firebase"

export const addExpense = async (data: any, userId: string) => {
    console.log("Add Expense")
    const expensesCollectionRef = collection(db, 'users', userId, 'expenses')

    const docRef = await addDoc(expensesCollectionRef, {
        amount: data.amount,
        category: data.category,
        description: data.description,
        createdAt: serverTimestamp(),
    })

}