import { collection, getDoc, getDocs } from "firebase/firestore"
import { usersCollection } from "../firebase"

export const getBudged = async () => {
    const budgedRef = collection(usersCollection, 'testusers', 'budgets')
    const expensesRef = await getDocs(budgedRef)
    const data = expensesRef.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
    }));
    return data

}