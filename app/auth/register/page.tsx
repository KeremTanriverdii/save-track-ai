import RegisterClient from '@/components/Client/Auth/RegisterClient'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Metadata } from 'next'
import Image from 'next/image'
import LoginGoogleProviderClient from '@/components/Client/Auth/LoginGoogleProviderClient'
import LoginAppleProviderClient from '@/components/Client/Auth/LoginAppleProviderClient'

export const metadata: Metadata = {
    title: 'Register Page',
    description: 'Register page for the app dashboard',
}

export default function page() {
    return (
        <div className='bg-[url("/bg-cover.png")] bg-cover bg-center bg-no-repeat'>
            <div className='flex items-center justify-center h-screen p-2'>
                <Card className='p-3'>
                    <CardTitle className='sm:px-6 text-center sm:text-start'>Register
                        <CardHeader className='p-1 sm:mt-2 text-center sm:text-start mt-2'>Join Us Today! Create Your Account</CardHeader>
                    </CardTitle>
                    <CardContent className='flex flex-col sm:flex-row items-stretch gap-5 justify-center h-full'>
                        <div className='order-2 sm:order-1'>
                            <RegisterClient />
                        </div>
                        <div className='float-right mx-auto mt-auto mb-auto h-full order-1 sm:order-2'>
                            <Image src="/asset-1.jpg" width={272} height={272} alt='cover-register' />
                        </div>
                    </CardContent>
                    <CardFooter className='flex-cols'>
                        <nav>
                            <Link href="/auth/login">Already have an account? Login</Link>
                        </nav>
                        <div className='flex-cols w-full'>
                            <LoginGoogleProviderClient />
                            <LoginAppleProviderClient />
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
