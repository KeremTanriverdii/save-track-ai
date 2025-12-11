import admin from "@/lib/firebase/admin";
import { cookies } from "next/headers"

export const getAuthenticatedUser = async (): Promise<string | null> => {
    const sessionCookie = (await cookies()).get("session")?.value
    if (!sessionCookie) {
        return null
    }
    try {
        const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true);
        const verifyUid: string = decodedClaims.uid
        return verifyUid
    } catch (err) {
        console.log(err)
        return null
    }
}