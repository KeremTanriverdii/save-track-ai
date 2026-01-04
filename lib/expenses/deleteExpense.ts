import admin from "../firebase/admin";

export const deleteExpense = async (verifyUid: string, id: string) => {
    const db = admin.firestore();
    try {
        const expenseDocRef = db.collection('users').doc(verifyUid).collection('expenses').doc(id);
        await expenseDocRef.delete();

        const budgetsCollectionRef = db.collection('users').doc(verifyUid).collection('budgets');
        const budgetsSnapshot = await budgetsCollectionRef.get();

        const batch = db.batch();

        budgetsSnapshot.docs.forEach((budgetDoc) => {
            batch.delete(budgetDoc.ref);
        });

        await batch.commit();


    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        console.error("Error deleting expense:", message);
        throw new Error(`Error deleting expense: ${message}`);
    }
};
