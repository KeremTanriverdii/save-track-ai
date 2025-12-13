"use client"
import { Button } from '@/components/ui/button'
import { auth } from '@/lib/firebase/firebase';
import { OAuthProvider, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { saveUserToFirestore } from '@/lib/authRecord/saveUserToFirestore';
import { User } from '@/lib/types/type';
import { createSessionCookie } from '@/utils/createSessionCookie';
import { Apple } from 'lucide-react';

const provider = new OAuthProvider('apple.com')

provider.addScope('email')
provider.addScope('name')

export default function LoginAppleProviderClient() {
    const router = useRouter();

    const handleAppleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            const newUser = {
                uid: user.uid,
                email: user.email || '',
                displayName: user.displayName || '',
                photoURL: user.photoURL || '',
            } as User;

            await saveUserToFirestore(newUser);
            const idToken = await user.getIdToken();
            await createSessionCookie(idToken);
            router.push('/dashboard');
        } catch (error) {
            console.error("Error signing in with Apple", error);
        }
    }

    return <Button onClick={handleAppleSignIn} className="w-full">Login with Apple <Apple /></Button>
}
