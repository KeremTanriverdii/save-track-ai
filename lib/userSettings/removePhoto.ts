"use server"

import { db, adminStorage, auth } from "../firebase/admin";
import { getAuthenticatedUser } from "@/utils/getAuthenticatedUser";
import { revalidatePath } from "next/cache";


export const removeProfilePhoto = async () => {
    try {
        const user = await getAuthenticatedUser();

        if (!user || !user.uid) throw new Error('Unauthorized');

        // Get auth provider
        const firebaseUser = await auth.getUser(user.uid);
        const provider = firebaseUser.providerData[0]?.providerId || 'password';
        const isOAuthUser = provider === 'google.com' || provider === 'apple.com';

        // Don't allow OAuth users to remove their provider photo
        if (isOAuthUser) {
            return {
                success: false,
                error: 'Cannot remove photo managed by authentication provider'
            };
        }



        const bucket = adminStorage.bucket();
        const userDocRef = db.collection("users").doc(user.uid);

        // Try to delete all possible photo formats
        const extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        const deletePromises = extensions.map(async (ext) => {
            const filePath = `users/${user.uid}/profile-photo.${ext}`;
            const fileRef = bucket.file(filePath);

            try {
                const [exists] = await fileRef.exists();
                if (exists) {
                    await fileRef.delete();
                    return true;
                }
            } catch (err) {
                console.log(`File not found: ${filePath}`);
            }
            return false;
        });

        await Promise.all(deletePromises);

        // Update Firestore to remove photoURL
        await userDocRef.set({
            photoURL: '',
            lastLogin: new Date()
        }, { merge: true });

        ("✅ Firestore updated - photoURL removed");

        // Update Firebase Auth to remove photoURL
        await auth.updateUser(user.uid, {
            photoURL: null as null, // Remove the photo
        });



        revalidatePath('/dashboard/settings');
        return { success: true };

    } catch (err: unknown) {
        console.error("❌ Remove Photo Error:", err);
        return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
    }
}