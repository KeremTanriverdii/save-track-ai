import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore"
import { db, usersCollection } from "../firebase/firebase"
import { dateCustom } from "@/utils/nowDate"
import { getBudget } from "../budged/GetBudget"

export default async function FetchAllAndMonthlyBudget(uid: string) {
    if (!uid) return null

    const userRef = doc(db, 'users', uid);
    const currentMonth = dateCustom();
    const budgetRef = doc(usersCollection, uid, 'budgets', currentMonth);

    try {
        const [userSnap, expensesSnap, budgetData] = await Promise.all([
            getDoc(userRef),
            getDocs(collection(db, 'users', uid, 'expenses')),
            getBudget(uid, currentMonth)
        ])


        if (!userSnap.exists()) {
            console.error('User document not found');
            return null;
        }

        const userData = userSnap.data()

        const [year, month] = currentMonth.split('-');
        let currentMonthTotal = 0;

        let date: Date;
        expensesSnap.forEach((doc) => {
            const expense = doc.data();
            const expenseDate = expense.date;

            if (typeof expenseDate === 'string') {
                date = new Date(expenseDate);
            } else if (expenseDate?.toDate) {
                date = expenseDate.toDate();
            } else if (expenseDate?.seconds) {
                date = new Date(expenseDate.seconds * 1000);
            } else {
                return;
            }

            if (date.getFullYear() === parseInt(year) &&
                date.getMonth() === parseInt(month) - 1) {
                currentMonthTotal += expense.amount || 0;
            }
        });

        const remaining = (budgetData?.budget || 0) - currentMonthTotal;

        const budgetDocSnap = await getDoc(budgetRef);
        if (budgetDocSnap.exists()) {
            await updateDoc(budgetRef, {
                monthlySpend: currentMonthTotal,
                remaining: remaining,
                lastUpdated: serverTimestamp()
            })
        } else {
            await setDoc(budgetRef, {
                budget: budgetData?.budget || 0,
                currency: budgetData?.currency || '$',
                projectedSubs: budgetData?.projectedSubs || 0,
                monthlySpend: currentMonthTotal,
                remaining: remaining,
                id: currentMonth,
                createdAt: serverTimestamp(),
                lastUpdated: serverTimestamp(),
                isAutoCarried: budgetData?.isAutoCarried || false
            });
        }
        return {
            allTime: {
                total: userData.totalSpent || 0,
                subsData: userData.totalSubscriptionSpent || 0,
                oneTimeTotal: userData.totalOneTimeSpent || 0
            },
            currentMonth: {
                monthId: currentMonth,
                budget: budgetData?.budget || 0,
                currency: budgetData?.currency || '$',
                totalMonth: currentMonthTotal,
                monthlySpend: currentMonthTotal,
                remaining: remaining,
                projectedSubs: budgetData?.projectedSubs || 0,
                source: budgetData?.source
            }
        }

    } catch (err) {
        return null
    }
}