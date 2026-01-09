
import admin from "../firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

export const writeResults = async (verifyUid: string, data: {
    summary: string;
    risks: string[];
    patterns: string[];
    suggestions: string[];
    dataTable: {
        columns: {
            accessorKey: string;
            header: string;
        }[];
        rows: {
            day: number;
            amount: number;
            title: string;
            category: string;
            exceeded: boolean;
            percentage: string;
            threshold: number;
        }[];
    }
}) => {

    if (!verifyUid) throw new Error("Missing required identifier: uid");

    const db = admin.firestore();

    try {
        const aiCoachingRef = db.collection('users').doc(verifyUid).collection('aiResults');

        const addDocRef = await aiCoachingRef.add({
            id: aiCoachingRef.id,
            insight: data,
            createdAt: FieldValue.serverTimestamp()
        });

        return addDocRef;
    } catch (error) {
        console.error("Error writing AI results to Firestore:", error);
        throw error;
    }
}