import { BudgetDeclareComponent } from '@/components/Client/Budget/BudgetDeclareComponent'
import BudgetShowComponent from '@/components/Client/Budget/BudgetShowComponent'
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
    const budgetData = response.budget;
    return (
        <div>
            Limit of your's budget:
            <BudgetDeclareComponent />
            <BudgetShowComponent budget={budgetData} />
        </div>
    )
}
