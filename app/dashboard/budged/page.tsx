import { BudgetDeclareComponent } from '@/components/Client/Budget/BudgetDeclareComponent'
import BudgetShowComponent from '@/components/Client/Budget/BudgetShowComponent'
import { Budged } from '@/lib/types/type'
import React from 'react'




export default async function page() {
    const baseUrl = 'http://localhost:3000'
    const url = `${baseUrl}/api/budged`

    const res = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },

    })
    if (!res.ok) {
        throw new Error('Error budged fetch')
    }

    const response = await res.json();
    const budgedData = response.data;
    return (
        <div>
            Limit of your's budget:
            <BudgetDeclareComponent />
            <BudgetShowComponent budgets={budgedData} />
        </div>
    )
}
