import admin from "@/lib/firebase/admin";
import { User, UserLog } from "@/lib/types/type";
import { cookies } from "next/headers"

export const getAuthenticatedUser = async (): Promise<UserLog | null> => {
    const sessionCookie = (await cookies()).get("session")?.value
    if (!sessionCookie) {
        return null
    }
    try {
        const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true);
        const verifyUid: string = decodedClaims.uid
        return {
            uid: verifyUid,
            name: decodedClaims.name || '',
            email: decodedClaims.email || '',
            photoURL: decodedClaims.picture || '',
        } as unknown as UserLog
    } catch (err) {
        console.log(err)
        return null
    }
}