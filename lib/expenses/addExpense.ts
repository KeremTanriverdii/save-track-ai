import { addDoc, collection, serverTimestamp, Timestamp } from "firebase/firestore"
import { db } from "../firebase/firebase"
import { Expense } from "../types/type"
import { da } from "date-fns/locale"

export const addExpense = async (data: any, userId: string) => {
    const expensesCollectionRef = collection(db, 'users', userId, 'expenses')

    const selectedDate = data.expenseDate ? new Date(data.expenseDate) : new Date();
    const docRef = await addDoc(expensesCollectionRef, {
        amount: data.amount,
        category: data.category,
        title: data.title,
        description: data.description,
        date: Timestamp.fromDate(selectedDate),
        createdAt: serverTimestamp(),
    })

}