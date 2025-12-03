import { collection, doc, getDoc, getDocs } from "firebase/firestore"
import { usersCollection } from "../firebase"
import { Budget } from "../types/type";

export const getBudget = async (yearMonth: string) => {
    // const budgedRef = collection(usersCollection, 'testusers', 'budgets')
    // const expensesRef = await getDocs(budgedRef)
    // const data = expensesRef.docs.map((doc) => ({
    //     id: doc.id === yearMonth ? doc.id : null,
    //     ...doc.data()
    // }));
    // return data
    const docRef = doc(usersCollection, 'testusers', 'budgets', yearMonth);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data() as Budget;
    return data.budget



}