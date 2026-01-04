'use client';

import { saveUserToFirestore } from '@/lib/authRecord/saveUserToFirestore';
import { auth as firebaseAuth } from '@/lib/firebase/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { User } from '@/lib/types/type';
import { useRouter } from 'next/navigation';
import { createSessionCookie } from '@/utils/createSessionCookie';
import { Button } from '@/components/ui/button';
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
    return (
        <Button className='w-full' onClick={handleGoogleSignIn}>
            Login with Google <img src="/google-logo.jpg" width={20} height={20} alt='google-logo' className='bg-transparent' />
        </Button>
    );
}