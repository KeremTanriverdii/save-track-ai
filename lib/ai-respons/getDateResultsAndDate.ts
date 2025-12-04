import { collection, getDocs, QueryDocumentSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { Delete } from "lucide-react";

/**
 * Fetches documents from users/{userId}/aiResults and returns an array with
 * { id, createdAt, data } where createdAt is an ISO string when available.
 *
 * Firestore stores serverTimestamp as a Timestamp object; this function
 * normalizes several possible shapes (Timestamp with toDate, seconds field,
 * numeric epoch, or ISO string) into an ISO string.
 */
export async function getDateResultsAndDate(userId = "testusers") {
    const aiResultsRef = collection(db, "users", userId, "aiResults");

    try {
        const snapshot = await getDocs(aiResultsRef);

        const results = snapshot.docs.map((doc: QueryDocumentSnapshot) => {
            const raw = doc.data() as Record<string, any>;

            const createdAtRaw = raw.createdAt;
            let createdAtIso: string | null = null;

            // Firestore Timestamp object has toDate()
            if (createdAtRaw && typeof createdAtRaw.toDate === "function") {
                createdAtIso = createdAtRaw.toDate().toISOString();
            } else if (
                createdAtRaw &&
                typeof createdAtRaw === "object" &&
                (createdAtRaw._seconds || createdAtRaw.seconds)
            ) {
                // Legacy / serialized Timestamp shape { _seconds: number }
                const seconds = createdAtRaw._seconds ?? createdAtRaw.seconds;
                createdAtIso = new Date(seconds * 1000).toISOString();
            } else if (typeof createdAtRaw === "number") {
                // Milliseconds since epoch
                createdAtIso = new Date(createdAtRaw).toISOString();
            } else if (typeof createdAtRaw === "string") {
                // ISO string or other date string
                const parsed = new Date(createdAtRaw);
                if (!Number.isNaN(parsed.getTime())) createdAtIso = parsed.toISOString();
            }

            return {
                id: doc.id,
                createdAt: createdAtIso,
                data: raw,
                icon: Delete as any
            };
        });

        return results;
    } catch (err) {
        console.error("Error fetching aiResults:", err);
        throw err;
    }
}

export default getDateResultsAndDate;