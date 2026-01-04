"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { registerUser } from '@/lib/auth/registerUser'
import { auth } from '@/lib/firebase/firebase'
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import React, { useReducer } from 'react'


const initialState = {
    email: '',
    password: '',
    userName: '',
    loading: false,
    error: '',
};

type Action =
    | { type: 'INPUT_CHANGE'; field: string; value: string }
    | { type: 'SET_LOADING', payload: boolean }
    | { type: 'SET_ERROR', payload: string }
    | { type: 'RESET_STATE' };


function formReducer(state: typeof initialState, action: Action) {
    switch (action.type) {
        case 'INPUT_CHANGE':
            return {
                ...state,
                [action.field]: action.value,
            }
        case 'SET_LOADING':
            return { ...state, loading: action.payload }
        case 'SET_ERROR':
            return { ...state, error: action.payload, loading: false }
        case 'RESET_STATE':
            return initialState
        default:
            return state
    }
}

const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
        return 'Password must be at least 8 characters long';
    }
    if (!/[A-Z]/.test(password)) {
        return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(password)) {
        return 'Password must contain at least one lowercase letter';
    }
    if (!/[0-9]/.test(password)) {
        return 'Password must contain at least one number';
    }
    return null;
};

const validateUsername = (username: string): string | null => {
    if (username.length < 3) {
        return 'Username must be at least 3 characters long';
    }
    if (username.length > 20) {
        return 'Username must be less than 20 characters';
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return 'Username can only contain letters, numbers, and underscores';
    }
    return null;
};

export default function RegisterClient() {
    const [state, dispatch] = useReducer(formReducer, initialState)
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: '' });

        const usernameError = validateUsername(state.userName);
        if (usernameError) {
            dispatch({ type: 'SET_ERROR', payload: usernameError });
            return;
        };

        const passwordError = validatePassword(state.password);
        if (passwordError) {
            dispatch({ type: 'SET_ERROR', payload: passwordError });
            return;
        };

        try {
            // Create user with Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                state.email,
                state.password
            );

            // Send email verification
            await sendEmailVerification(userCredential.user);

            // Get ID token
            const idToken = await userCredential.user.getIdToken();

            // Call server action to create session and save to Firestore
            const result = await registerUser({
                idToken,
                userName: state.userName,
                email: state.email,
            });

            if (!result.success) {
                throw new Error(result.error || 'Registration failed');
            }

            // Show success message about email verification
            alert('Registration successful! Please check your email to verify your account.');

            router.push('/dashboard');
            router.refresh();

        } catch (err) {
            console.error('Registration Error:', err);

            let errorMessage = 'Unexpected error occurred. Please try again.';
            const firebaseErrorCode = (err as { code?: string })?.code;

            if (firebaseErrorCode) {
                switch (firebaseErrorCode) {
                    case 'auth/email-already-in-use':
                        errorMessage = 'This email address is already in use.';
                        break;
                    case 'auth/weak-password':
                        errorMessage = 'Password should be at least 8 characters long with mixed case and numbers.';
                        break;
                    case 'auth/invalid-email':
                        errorMessage = 'Please enter a valid email address.';
                        break;
                    case 'auth/network-request-failed':
                        errorMessage = 'Network request failed. Please check your internet connection.';
                        break;
                    case 'auth/too-many-requests':
                        errorMessage = 'Too many attempts. Please try again later.';
                        break;
                    default:
                        errorMessage = `An error occurred: ${firebaseErrorCode}`;
                }
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }

            dispatch({ type: 'SET_ERROR', payload: errorMessage })
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch({
            type: 'INPUT_CHANGE',
            field: e.target.name,
            value: e.target.value,
        })
    }
    return (
        <div>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                <div className='w-full'>
                    <label htmlFor='username' className="block mb-2">
                        Username
                    </label>
                    <Input
                        type="text"
                        name="userName"
                        id='username'
                        required
                        minLength={3}
                        maxLength={20}
                        pattern="^[a-zA-Z0-9_]+$"
                        title="Username can only contain letters, numbers, and underscores"
                        className='border-2 rounded-md'
                        onChange={handleInputChange}
                        value={state.userName}
                        disabled={state.loading}
                    />
                </div>

                <div className='w-full'>
                    <label htmlFor='email' className="block mb-2">
                        E-mail
                    </label>
                    <Input
                        type="email"
                        name="email"
                        id='email'
                        required
                        className='border-2 rounded-md'
                        onChange={handleInputChange}
                        value={state.email}
                        disabled={state.loading}
                        autoComplete="email"
                    />
                </div>

                <div className='w-full'>
                    <label htmlFor='password' className="block mb-2">
                        Password
                    </label>
                    <Input
                        type="password"
                        name="password"
                        id='password'
                        required
                        minLength={8}
                        className='border-2 rounded-md'
                        onChange={handleInputChange}
                        value={state.password}
                        disabled={state.loading}
                        autoComplete="new-password"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                        Must be 8+ characters with uppercase, lowercase, and numbers
                    </p>
                </div>

                {state.error && (
                    <p className="text-red-500 text-sm">{state.error}</p>
                )}

                <Button
                    type="submit"
                    className='w-full'
                    disabled={state.loading}
                >
                    {state.loading ? 'Creating account...' : 'Register'}
                </Button>
            </form>
        </div>
    )
}