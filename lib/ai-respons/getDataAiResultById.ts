import admin from "../firebase/admin";

export const getDataAiResultById = async (verifyUid: string, id: string) => {
    // Get the firestore inside aiResults collection and inside with id document return the data
    if (!id || !verifyUid) throw new Error("Missing required identifiers: uid or id");

    const db = admin.firestore();
    const snap = await db.collection('users').doc(verifyUid).collection('aiResults').doc(id).get();
    if (!snap.exists) return null;
    return snap.data();
}