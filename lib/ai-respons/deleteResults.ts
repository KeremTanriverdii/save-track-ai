
import { db } from "../firebase/admin";

export const deleteDataById = async (verifyUid: string, id: string): Promise<void> => {
    if (!id || !verifyUid) {
        throw new Error("Missing required identifiers: uid or id");
    }

    try {
        // 2. Reference the specific document
        await db.
            collection('users')
            .doc(verifyUid)
            .collection('aiResults')
            .doc(id).delete();

    } catch (error) {
        console.error("Error deleting document:", error);
        throw new Error("Failed to delete data. Please try again.");
    }
};