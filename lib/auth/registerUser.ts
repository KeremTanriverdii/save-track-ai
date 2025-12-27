// app/lib/auth/actions.ts
"use server"

import { cookies } from 'next/headers';
import { db, auth } from '@/lib/firebase/admin';
import { dateCustom } from '@/utils/nowDate';

export async function registerUser({
    idToken,
    userName,
    email,
}: {
    idToken: string;
    userName: string;
    email: string;
}) {
    try {
        // Verify the ID token
        const decodedToken = await auth.verifyIdToken(idToken);
        const uid = decodedToken.uid;

        // Check if username is already taken
        const usernameQuery = await db
            .collection('users')
            .where('displayName', '==', userName)
            .get();

        if (!usernameQuery.empty) {
            return {
                success: false,
                error: 'Username is already taken'
            };
        }

        // Create session cookie (5 days)
        const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
        const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });

        // Set cookie
        const cookieStore = await cookies();
        cookieStore.set('session', sessionCookie, {
            maxAge: expiresIn,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
        });

        // Save user to Firestore
        await db.collection('users').doc(uid).set({
            uid,
            email,
            displayName: userName,
            photoURL: '',
            lastLogin: new Date(),
            currency: '$',
            createdAt: new Date(),
            emailVerified: false, // Track verification status
        });

        const date = dateCustom()
        await db.collection('users').doc(uid).collection('budgets').doc(date).set({
            budget: 0,
            currency: '$'
        })

        return { success: true };

    } catch (error) {
        console.error('Server registration error:', error);
        return {
            success: false,
            error: 'Failed to create account. Please try again.'
        };
    }
}