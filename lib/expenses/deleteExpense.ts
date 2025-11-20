import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";

export const deleteExpense = async (id: string) => {
    try {
        // Create a reference to the specific expense document to be deleted
        const expenseDocRef = doc(db, 'users', 'testusers', 'expenses', id);
        await deleteDoc(expenseDocRef);

        console.log('Expense deleted successfully')

    } catch (err) {
        throw new Error('Error deleting expense: ' + err);
    }
};