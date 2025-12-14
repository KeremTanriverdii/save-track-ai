import UserChangePPClient from '@/components/Client/Settings/UserChangePPClient';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { getUserData } from '@/lib/auth/user'
import { getSettings } from '@/lib/auth/userDat';
import { User } from '@/lib/types/type';
import React from 'react'

export default async function SettingsPage() {
    const settings = await getSettings();
    return (
        <div>
            <div className='grid gap-4 p-2'>
                <h2>User Settings</h2>
                <p>Manage your personal details and application prefences.</p>
                <br />
                <UserChangePPClient settings={settings} />
            </div>
        </div>
    )
}
