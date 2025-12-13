"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
            <form onSubmit={handleSubmit} className='flex-cols h-full '>
                <div className='w-full'>
                    <label htmlFor='username'>
                        <span className="mr-4">Username</span>
                        <Input
                            type="text"
                            name="userName"
                            id='username'
                            required
                            className='border-2 rounded-md'
                            onChange={handleInputChange}
                            value={state.userName}
                            disabled={state.loading}
                        />
                    </label>
                </div>
                <div className='w-full'>
                    <label htmlFor='email'>E-mail</label>
                    <Input
                        type="email"
                        name="email"
                        id='email'
                        required className='border-2 rounded-sm'
                        onChange={handleInputChange}
                        value={state.email}
                        disabled={state.loading}
                    />
                </div>
                <div className='w-full'>
                    <label htmlFor='passsword'>Password</label>
                    <Input
                        type="password"
                        name="password"
                        id='password'
                        required
                        className='border-2 rounded-md'
                        onChange={handleInputChange}
                        value={state.password}
                        disabled={state.loading}
                    />
                </div>
                <br />
                <Button type="submit" className='mt-auto w-full' disabled={state.loading}>Register</Button>
            </form>
            {state.error && <p className="text-red-500">{state.error}</p>}
            {state.loading && <p>Loading...</p>}
        </div>
    )
}