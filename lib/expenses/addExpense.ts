import { addDoc, collection, serverTimestamp, Timestamp } from "firebase/firestore"
import { db } from "../firebase/firebase"
import { Expense, ExpensePayload } from "../types/type"
import { da } from "date-fns/locale"
import { getBudget } from "../budged/GetBudget"
import { dateCustom } from "@/utils/nowDate"
import { DialogState } from "@/components/Client/TestAddExpense"

export const addExpense = async (userSend: ExpensePayload, userId: string) => {
    const expensesCollectionRef = collection(db, 'users', userId, 'expenses')
    const selectedDate = userSend.expenseDate ? new Date(userSend.expenseDate) : new Date();
    const date = dateCustom()
    const budget = await getBudget(userId, date) as { budget: number, currency: string }

    const finalData: any = {
        amount: userSend.amount,
        category: Array.isArray(userSend.category) ? userSend.category : [userSend.category],
        title: userSend.title || "",
        description: userSend.description || "",
        date: Timestamp.fromDate(selectedDate),
        createdAt: serverTimestamp(),
        currency: budget?.currency || "USD",
        type: userSend.type || 'one-time'
    }

    if (userSend.type === 'subscription' && userSend.subscription) {
        finalData.subscriptionDetails = {
            frequency: userSend.subscription.frequency,
            startDate: Timestamp.fromDate(new Date(userSend.subscription.startDate)),
            status: userSend.subscription.status || "active",
            billingDay: Number(userSend.subscription.billingDay),
            billingMonth: Number(userSend.subscription.billingMonth)
        }
    }
    return await addDoc(expensesCollectionRef, finalData);
}