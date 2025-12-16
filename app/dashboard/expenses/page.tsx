import DataTableClientComponent from '@/components/Client/DataTableClientComponent';
import TestAddExpense from '@/components/Client/TestAddExpense'
import { getUserData } from '@/lib/auth/user';
import { getExpenses } from '@/lib/expenses/getExpense'
import { Expense } from '@/lib/types/type';


export default async function page() {
    const user = await getUserData()
    const userId = user?.uid as string
    const rawData: Expense[] = await getExpenses(userId);

    if (!rawData) {
        throw new Error('No data found')
    }

    const data = rawData.map(expense => ({
        ...expense,
        date: (expense.createdAt as any)?.toDate?.().toISOString() || null,
        createdAt: null,
    }));

    return (
        <div>
            {/* <ListExpensesShow initialData={data} /> */}
            <DataTableClientComponent data={data} />
            <TestAddExpense />
        </div>
    )
}
