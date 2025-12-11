import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { usersCollection } from "../firebase/firebase"

export const addbudget = async (bud: number, id: string | null, yearMonth: string) => {
    if (!id && !bud && !yearMonth) {
        throw new Error('Missing required fields')
    }

    try {
        const budgedCollection = doc(collection(usersCollection, id as string, 'budgets'), yearMonth);

        await setDoc(budgedCollection, {
            createdAt: serverTimestamp(),
            budget: bud,
        }, { merge: true })
    } catch (err) {
        throw new Error('Error budged')
    }
}