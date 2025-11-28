import { addDoc, collection, doc, serverTimestamp, setDoc, Timestamp } from "firebase/firestore";
import { usersCollection } from "../firebase"

export const addbudget = async (bud: number) => {
    if (!bud) return

    const date = new Date();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const yearMonth = `${date.getFullYear()}-${month}`;

    const budgedCollection = doc(collection(usersCollection, 'testusers', 'budgets'), yearMonth);

    try {
        await setDoc(budgedCollection, {
            id: Timestamp.now(),
            budget: bud
        })
    } catch (err) {
        throw new Error('Error budged')
    }
}