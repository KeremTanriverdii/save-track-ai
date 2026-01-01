import { doc, deleteDoc, collection, getDocs, writeBatch } from "firebase/firestore";
import { db } from "../firebase/firebase";

export const deleteExpense = async (verifyUid: string, id: string) => {
    try {
        const expenseDocRef = doc(db, "users", verifyUid, "expenses", id);
        await deleteDoc(expenseDocRef);

        const budgetsCollectionRef = collection(db, "users", verifyUid, "budgets");
        const budgetsSnapshot = await getDocs(budgetsCollectionRef);

        const batch = writeBatch(db);

        budgetsSnapshot.docs.forEach((budgetDoc) => {
            batch.delete(budgetDoc.ref);
        });

        await batch.commit();


    } catch (err: any) {
        console.error("Error deleting expense:", err.message);
        throw new Error(`Error deleting expense: ${err.message}`);
    }
};
