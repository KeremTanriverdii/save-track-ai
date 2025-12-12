import RegisterClient from '@/components/Client/Auth/RegisterClient'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Register Page',
    description: 'Register page for the app dashboard',
}

export default function page() {
    return (
        <div className='flex items-center justify-center h-screen'>
            <Card className='w-1/3'>
                <CardTitle>Register
                    <CardHeader>Join Us Today! Create Your Account</CardHeader>
                </CardTitle>
                <CardContent>
                    <RegisterClient />
                </CardContent>
                <Link href="/auth/login">Already have an account? Login</Link>
            </Card>
        </div>
    )
}
