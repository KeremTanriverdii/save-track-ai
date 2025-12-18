import DataTableClientComponent from '@/components/Client/DataTableClientComponent';
import TestAddExpense from '@/components/Client/TestAddExpense'
import { Button } from '@/components/ui/button';
import { getUserData } from '@/lib/auth/user';
import { getExpenses } from '@/lib/expenses/getExpense'
import { Expense } from '@/lib/types/type';
import { Download } from 'lucide-react';


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
        <div className='grid grid-cols-1 gap-5 me-2 mt-5'>
            {/* <ListExpensesShow initialData={data} /> */}
            <div className="flex justify-between items-center">
                <div className='flex flex-col gap-2'>
                    <h2 className='font-bold sm:text-4xl'>Expenses</h2>
                    <p className='text-sm'>Filter, sort, and examine your expenses in detail.</p>
                </div>

                <div className='flex flex-col gap-2 sm:flex-row'>
                    <Button> <Download /> Export</Button>
                    <TestAddExpense />
                </div>
            </div>
            <DataTableClientComponent data={data} />

        </div>
    )
}
