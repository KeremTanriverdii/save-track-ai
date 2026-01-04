import { auth } from '@/lib/firebase/firebase';
import { EmailAuthProvider, GoogleAuthProvider, OAuthProvider, reauthenticateWithCredential, reauthenticateWithPopup } from 'firebase/auth';
import React, { useState } from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { Input } from '../ui/input';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '../ui/button';

type Props = {
    onSuccess: () => void;
    children: React.ReactNode;
}

export default function ReAuthDialog({ onSuccess, children }: Props) {
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const providerId = auth.currentUser?.providerData[0].providerId;

    const resetStates = () => {
        setPassword('')
        setError(null)
        setShowPassword(false)
    }

    const handleReauth = async () => {
        setError(null)
        setLoading(true)

        try {
            const user = auth.currentUser
            if (!user) throw new Error("User not found")

            if (providerId === "password") {
                const email = user.email
                if (!email) throw new Error("User email not found")
                if (!password.trim()) {
                    setError("Please enter your password")
                    setLoading(false)
                    return
                }

                const credential = EmailAuthProvider.credential(email, password)
                await reauthenticateWithCredential(user, credential)
            }

            else if (providerId === "apple.com") {
                const provider = new OAuthProvider("apple.com")
                await reauthenticateWithPopup(user, provider)
            }

            else if (providerId === "google.com") {
                const provider = new GoogleAuthProvider()
                await reauthenticateWithPopup(user, provider)
            }

            else {
                throw new Error(`Not allowed provider: ${providerId}`)
            }

            await onSuccess()
            resetStates()
        } catch (err: unknown | Error) {
            setError((err as Error).message || "Again auth failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Verify Your Identity</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action is irreversible. Verify your identity to continue.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                {providerId === "password" && (
                    <div className="relative space-y-1">
                        <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Şifre"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <button
                            type="button"
                            className="absolute right-3 top-2 text-neutral-500"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                )}

                {error && (
                    <p className="text-sm text-red-500 mt-2">{error}</p>
                )}

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading}>
                        Cancel
                    </AlertDialogCancel>

                    <AlertDialogAction asChild>
                        <Button
                            disabled={loading}
                            onClick={handleReauth}
                            variant={providerId === "password" ? "default" : "secondary"}
                        >
                            {loading ? "Veifying..." :
                                providerId === "google.com" ? "Verify with Google" :
                                    providerId === "apple.com" ? "Verify with Apple" : "Confirm"}
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

    )
}
