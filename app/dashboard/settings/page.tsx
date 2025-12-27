import UserChangePPClient from '@/components/Client/Settings/UserChangePPClient';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { getUserData } from '@/lib/auth/user'
import { getSettings } from '@/lib/auth/userDat';
import { db } from '@/lib/firebase/admin';
import { User } from '@/lib/types/type';
import { dateCustom } from '@/utils/nowDate';
import { auth } from 'firebase-admin';
import { redirect } from 'next/navigation';
import React from 'react'

export default async function SettingsPage() {
    const user = await getUserData();
    if (!user) redirect('/login');

    // Get auth provider info
    const firebaseUser = await auth().getUser(user.uid);
    const provider = firebaseUser.providerData[0]?.providerId || 'password';
    const dateThisMonth = dateCustom()
    // Check if user is using OAuth (Google/Apple)
    const isOAuthUser = provider === 'google.com' || provider === 'apple.com';

    // Get user settings from Firestore
    const userDoc = await db.collection("users").doc(user.uid).get();
    const budgetDoc = await db.collection("users").doc(user.uid).collection("budgets").doc(dateThisMonth).get();
    const userData = userDoc.data();
    const budgetData = budgetDoc.data()
    const settings = {
        displayName: userData?.displayName || user.displayName,
        email: user.email,
        photoURL: userData?.photoURL || user.photoURL,
        currency: budgetData?.currency || '₺',
        provider: provider, // Pass provider to client
        isOAuthUser: isOAuthUser, // Pass flag to client
        budget: budgetData?.budget || 0
    };
    return (
        <div>
            <div className='grid gap-4 p-2'>
                <h2>User Settings</h2>
                <p>Manage your personal details and application prefences.</p>
                <br />
                <UserChangePPClient settings={settings} />
            </div>
        </div>
    )
}
