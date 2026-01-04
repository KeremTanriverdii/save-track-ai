import { FieldValue } from "firebase-admin/firestore";
import admin from "../firebase/admin";

export const addbudget = async (bud: number, id: string | null, yearMonth: string) => {
    if (!id && !bud && !yearMonth) {
        throw new Error('Missing required fields')
    }
    const db = admin.firestore();
    try {
        const budgedCollection = db.collection('users').doc(id as string).collection('budgets').doc(yearMonth);

        await budgedCollection.set({
            createdAt: FieldValue.serverTimestamp(),
            budget: bud,
        }, { merge: true })
    } catch (err) {
        throw new Error('Error budged')
    }
}