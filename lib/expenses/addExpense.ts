import { addDoc, collection, serverTimestamp, Timestamp } from "firebase/firestore"
import { db } from "../firebase/firebase"
import { Expense } from "../types/type"
import { da } from "date-fns/locale"
import { getBudget } from "../budged/GetBudget"
import { dateCustom } from "@/utils/nowDate"

export const addExpense = async (data: any, userId: string) => {
    const expensesCollectionRef = collection(db, 'users', userId, 'expenses')


    const selectedDate = data.expenseDate ? new Date(data.expenseDate) : new Date();
    const date = dateCustom()
    const budget = await getBudget(userId, date) as { budget: number, currency: string }

    const docRef = await addDoc(expensesCollectionRef, {
        amount: data.amount,
        category: data.category,
        title: data.title,
        description: data.description,
        date: Timestamp.fromDate(selectedDate),
        createdAt: serverTimestamp(),
        currency: budget?.currency
    })

}