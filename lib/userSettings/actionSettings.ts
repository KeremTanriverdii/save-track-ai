"use server"

import { db, adminStorage, auth } from "../firebase/admin";
import { getAuthenticatedUser } from "@/utils/getAuthenticatedUser";
import { revalidatePath } from "next/cache";
import { dateCustom } from "@/utils/nowDate";

export const setSettings = async (formData: FormData) => {
    try {
        const authResult = await getAuthenticatedUser();
        const uid = typeof authResult === 'string' ? authResult : authResult?.uid;

        if (!uid) throw new Error('Unauthorized');

        const displayName = formData.get('name') as string;
        const currency = formData.get('currency') as string;
        const budgetValue = Number(formData.get('budget'));
        const imageFile = formData.get("profileImage") as File | null;



        const date = dateCustom();
        const now = new Date();

        const firebaseAuthUser = await auth.getUser(uid);


        const batch = db.batch();
        const userDocRef = db.collection("users").doc(uid);
        const budgetDocRef = userDocRef.collection("budgets").doc(date);

        let userUpdates: any = {
            displayName: displayName,
            currency: currency,
            lastLogin: now
        };

        let newPhotoURL: string | null = null;

        if (imageFile && imageFile.size > 0 && imageFile.name) {

            const fileExtension = imageFile.name.split('.').pop();
            const filePath = `users/${uid}/profile-photo.${fileExtension}`;

            const bucket = adminStorage.bucket();
            const fileRef = bucket.file(filePath);

            const buffer = Buffer.from(await imageFile.arrayBuffer());


            await fileRef.save(buffer, {
                metadata: {
                    contentType: imageFile.type,
                },
            });

            await fileRef.makePublic();

            newPhotoURL = `https://storage.googleapis.com/${bucket.name}/${filePath}`;


            userUpdates.photoURL = newPhotoURL;
        }



        batch.set(userDocRef, userUpdates, { merge: true });

        batch.set(budgetDocRef, {
            budget: budgetValue,
            createdAt: now,
            currency: currency
        }, { merge: true });

        await batch.commit();


        // 🔥 CRITICAL: Update Firebase Auth profile for ALL providers
        // This ensures the auth token has the latest data
        const authUpdates: any = {};

        if (displayName) {
            authUpdates.displayName = displayName;
        }

        if (newPhotoURL) {
            authUpdates.photoURL = newPhotoURL;
        }

        // Only update if there's something to update
        if (Object.keys(authUpdates).length > 0) {
            await auth.updateUser(uid, authUpdates);
        }

        revalidatePath('/dashboard/settings');
        return { success: true };

    } catch (err: any) {
        console.error("❌ Firebase Update Error:", err);
        return { success: false, error: err.message };
    }
}