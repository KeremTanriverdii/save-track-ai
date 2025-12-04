'use client';

import { saveUserToFirestore } from '@/lib/authRecord/saveUserToFirestore';
import { auth as firebaseAuth } from '@/lib/firebase/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { User } from '@/lib/types/type';
import { useRouter } from 'next/navigation';
const provider = new GoogleAuthProvider();


export default function LoginGoogleProviderClient() {
    const router = useRouter();
    const handleGoogleSignIn = async () => {
        const authS = firebaseAuth; // Get the Auth instance

        try {
            const result = await signInWithPopup(authS, provider);
            const user = result.user;

            const newUser = {
                uid: user.uid,
                email: user.email || '',
                displayName: user.displayName || '',
                photoURL: user.photoURL || '',
            } as User
            await saveUserToFirestore(newUser)
            //    Get ID Token
            const idToken = await user.getIdToken();

            // 2. Send token to api route
            await createSessionCookie(idToken);

            // Success: Direction to page of protected
            // window.location.href = '/dashboard';
            router.push('/dashboard');

        } catch (error) {
            console.error("Login error:", error);
            // Error management
        }
    };


    const createSessionCookie = async (token: string) => {
        const response = await fetch('/api/sessionLogin', {
            method: 'POST',
            headers: {
                // Token'ı Authorization başlığında taşıyoruz
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error("Don't create session cookie.");
        }
    };

    return (
        <button onClick={handleGoogleSignIn}>
            Google ile Giriş Yap
        </button>
    );
}