import { BudgetDeclareComponent } from '@/components/Client/Budget/BudgetDeclareComponent'
import BudgetShowComponent from '@/components/Client/Budget/BudgetShowComponent'
import { Budget } from '@/lib/types/type'
import { cookies } from 'next/headers'

export default async function page() {
    const baseUrl = 'http://localhost:3000'
    const url = `${baseUrl}/api/budget`
    const sessionCookie = (await cookies()).get('session')
    const res = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...(sessionCookie && { 'Cookie': `${sessionCookie.name}=${sessionCookie.value}` }),

        },
        cache: 'no-store',
    })
    if (!res.ok) {
        throw new Error('Error budget fetch')
    }

    const response = await res.json();
    const budgetData: Budget = response.budget;
    return (
        <div
            className='grid gap-2  max-w-4xl mx-auto sm:mt-25 mt-7'
        >
            <div>
                <h2 className='2xl:text-4xl font-bold'>Budget Settings</h2>
                <p>Manage your monthly expenses here for limits.</p>
            </div>

            <BudgetShowComponent
                {...budgetData}
            />
            <BudgetDeclareComponent
                {...budgetData}
            />

        </div>
    )
}
