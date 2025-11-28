import { DeleteExpenseButton } from '@/components/Client/DeleteExpenseButton';
import ListExpensesShow from '@/components/Client/ListExpensesShow';
import TestAddExpense from '@/components/Client/TestAddExpense'
import { UpdateExpenseButton } from '@/components/Client/UpdateExpenseButton';
import { getExpenses } from '@/lib/expenses/getExpense'
import { Expense } from '@/lib/types/type';
import React from 'react'

export default async function page() {
    const data: any[] = await getExpenses();
    console.log(data)
    return (
        <div>
            <ListExpensesShow initialData={data} />
            <TestAddExpense />
        </div>
    )
}
