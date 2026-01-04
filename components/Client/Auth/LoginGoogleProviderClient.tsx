'use client';

import { auth as firebaseAuth } from '@/lib/firebase/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { User } from '@/lib/types/type';
import { useRouter } from 'next/navigation';
import { createSessionCookie } from '@/utils/createSessionCookie';
import { Button } from '@/components/ui/button';
import { saveUserToFirestoreAction } from '@/lib/authRecord/saveUserToFirestore';

const provider = new GoogleAuthProvider();

export default function LoginGoogleProviderClient() {
    const router = useRouter();

    const handleGoogleSignIn = async () => {
        const authS = firebaseAuth;
        try {
            const result = await signInWithPopup(authS, provider);
            const user = result.user;

            const newUser = {
                uid: user.uid,
                email: user.email || '',
                displayName: user.displayName || '',
                photoURL: user.photoURL || '',
            } as User;

            // Use server action instead of direct import
            await saveUserToFirestoreAction(newUser);

            const idToken = await user.getIdToken();
            await createSessionCookie(idToken);

            router.push('/dashboard');
        } catch (error) {
            console.error("Login error:", error);
        }
    };

    return (
        <Button className='w-full' onClick={handleGoogleSignIn}>
            Login with Google <img src="/google-logo.jpg" width={20} height={20} alt='google-logo' className='bg-transparent' />
        </Button>
    );
}