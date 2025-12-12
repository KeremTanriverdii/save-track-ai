"use client"
import { saveUserToFirestore } from '@/lib/authRecord/saveUserToFirestore'
import { auth } from '@/lib/firebase/firebase'
import { User } from '@/lib/types/type'
import { createSessionCookie } from '@/utils/createSessionCookie'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import React, { useReducer, useState } from 'react'


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

export default function RegisterClient() {
    const [state, dispatch] = useReducer(formReducer, initialState)
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: '' })

        try {
            const user = await createUserWithEmailAndPassword(auth, state.email, state.password);
            const idToken = await user.user.getIdToken();
            await createSessionCookie(idToken);

            const newUser: User = {
                uid: user.user.uid,
                email: user.user.email || '',
                displayName: state.userName,
                photoURL: '',
                lastLogin: new Date(),
            }
            await saveUserToFirestore(newUser)
            router.push('/dashboard')
        } catch (err) {
            console.error('Registered Error:', err);

            let errorMessage = 'Unexpected error occurred. Please try again.';
            const firebaseErrorCode = (err as any)?.code;

            // 2. Hata Kodu Çevirisi (Firebase Hataları)
            if (firebaseErrorCode) {
                switch (firebaseErrorCode) {
                    case 'auth/email-already-in-use':
                        errorMessage = 'This email address is already in use.';
                        break;
                    case 'auth/weak-password':
                        errorMessage = 'Password should be at least 6 characters long.';
                        break;
                    case 'auth/invalid-email':
                        errorMessage = 'Please enter a valid email address.';
                        break;
                    case 'auth/network-request-failed':
                        errorMessage = 'Network request failed. Please check your internet connection.';
                        break;
                    default:
                        // Bilinmeyen Firebase hatası
                        errorMessage = 'Identify error occurred.(Code: ' + firebaseErrorCode + ')';
                }
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
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Email:
                        <input
                            type="email"
                            name="email"
                            required className='border-2 rounded-sm'
                            onChange={handleInputChange}
                            value={state.email}
                            disabled={state.loading}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Password:
                        <input
                            type="password"
                            name="password"
                            required
                            className='border-2 rounded-md'
                            onChange={handleInputChange}
                            value={state.password}
                            disabled={state.loading}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        User Name:
                        <input
                            type="text"
                            name="userName"
                            required
                            className='border-2 rounded-md'
                            onChange={handleInputChange}
                            value={state.userName}
                            disabled={state.loading}
                        />
                    </label>
                </div>
                <br />
                <button type="submit" disabled={state.loading}>Register</button>
            </form>
            {state.error && <p className="text-red-500">{state.error}</p>}
            {state.loading && <p>Loading...</p>}
        </div>
    )
}