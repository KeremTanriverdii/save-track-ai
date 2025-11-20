import { collection, doc, getDocs } from "firebase/firestore"
import { db } from "../firebase"

export const getExpenses = async () => {
    try {
        const usersCollection = doc(db, 'users', 'testusers');

        const expensesCollectionRef = collection(usersCollection, 'expenses')
        const querySnapshot = await getDocs(expensesCollectionRef)
        const data = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }));
        return data
    } catch (err) {
        throw new Error('Error getting expenses' + err)
    }
}