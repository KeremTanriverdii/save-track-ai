import LoginAppleProviderClient from '@/components/Client/Auth/LoginAppleProviderClient'
import LoginFormClient from '@/components/Client/Auth/LoginFormClient'
import LoginGoogleProviderClient from '@/components/Client/Auth/LoginGoogleProviderClient'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export const metadata: Metadata = {
    title: 'Login Page',
    description: 'Login page for the app dashboard',
}

export default function page() {
    return (
        <div className='bg-[url("/bg-login.png")] bg-cover bg-center bg-no-repeat'>
            <div className='flex items-center justify-center h-screen'>
                <Card>
                    <CardTitle className='sm:px-6 text-center sm:text-start'>Login
                        <CardHeader className='p-1 sm:mt-2 text-center sm:text-start mt-2'>If You are Already A Member. Easily Login</CardHeader>
                    </CardTitle>
                    <CardContent className='flex flex-col sm:flex-row items-stretch gap-5 justify-center h-full'>
                        <LoginFormClient />
                        <div>
                            <Image src="/bwink.jpg" width={150} height={150} alt="logo" className='bg-light rounded-md h-fit w-full sm:w-auto' />
                        </div>
                    </CardContent>
                    <CardFooter className='flex-cols'>
                        <nav>
                            <Link href="/auth/register">dont have an account? Register</Link>
                        </nav>

                        <div className='flex-cols-2 w-full'>
                            <LoginGoogleProviderClient />
                            <LoginAppleProviderClient />
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
