"use client"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { auth } from '@/lib/firebase/firebase';
import { createSessionCookie } from '@/utils/createSessionCookie';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import React, { useReducer } from 'react'

const initialState = {
    email: '',
    password: '',
    loading: false,
    error: '',
}

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



export default function LoginFormClient() {
    const [state, dispatch] = useReducer(formReducer, initialState)
    const router = useRouter();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch({
            type: 'INPUT_CHANGE',
            field: e.target.name,
            value: e.target.value,
        })
    }


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: '' })

        try {
            const userCredential = await signInWithEmailAndPassword(auth, state.email, state.password);
            const idToken = await userCredential.user.getIdToken();

            if (!idToken) {
                throw new Error('No token found');
            }

            await createSessionCookie(idToken);
            router.push('/dashboard');
        } catch (err) {
            console.error('Login Error:', err);

            let errorMessage = 'Unexpected error occurred. Please try again.';
            const firebaseErrorCode = (err as { code?: string })?.code;
            if (firebaseErrorCode) {
                switch (firebaseErrorCode) {
                    case 'auth/user-not-found':
                        errorMessage = 'User not found.';
                        break;
                    case 'auth/wrong-password':
                        errorMessage = 'Incorrect password.';
                        break;
                    case 'auth/invalid-email':
                        errorMessage = 'Please enter a valid email address.';
                        break;
                    case 'auth/network-request-failed':
                        errorMessage = 'Network request failed. Please check your internet connection.';
                        break;
                    default:
                        errorMessage = 'Identify error occurred.(Code: ' + firebaseErrorCode + ')';
                }
            }
            dispatch({ type: 'SET_ERROR', payload: errorMessage })
        }
    }
    return (
        <div>
            <form onSubmit={handleSubmit} className='flex-cols h-full'>
                <div className='w-full'>
                    <label htmlFor='email'>
                        Email
                    </label>
                    <Input
                        type="email"
                        name="email"
                        id='email'
                        required
                        onChange={handleInputChange}
                        value={state.email}
                        disabled={state.loading}
                    />
                </div>

                <div className='w-full'>
                    <label htmlFor='password'>
                        Password
                    </label>
                    <Input
                        type="password"
                        name="password"
                        id='password'
                        required
                        onChange={handleInputChange}
                        value={state.password}
                        disabled={state.loading}
                    />
                </div>
                <Button type="submit" disabled={state.loading} className='w-full mt-2' >Login</Button>
            </form>
            {state.error && <p className="text-red-500">{state.error}</p>}
            {state.loading && <p>Loading...</p>}
        </div>
    )
}
