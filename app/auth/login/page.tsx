import LoginFormClient from '@/components/Client/Auth/LoginFormClient'
import LoginGoogleProviderClient from '@/components/Client/Auth/LoginGoogleProviderClient'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

export const metadata: Metadata = {
    title: 'Login Page',
    description: 'Login page for the app dashboard',
}

export default function page() {
    return (
        <div className='flex items-center justify-center h-screen'>
            <Card className='w-1/3'>
                <CardTitle>Login
                    <CardHeader>If You are Already A Member. Easily Login</CardHeader>
                </CardTitle>
                <CardContent>
                    <LoginFormClient />
                </CardContent>
                <LoginGoogleProviderClient />
                <br />
                <div>Or dont have an account?
                    <Link href="/auth/register">Register</Link>
                </div>
            </Card>
        </div>
    )
}
