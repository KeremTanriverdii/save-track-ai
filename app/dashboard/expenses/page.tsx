import ListExpensesShow from '@/components/Client/ListExpensesShow';
import TestAddExpense from '@/components/Client/TestAddExpense'
import { getExpenses } from '@/lib/expenses/getExpense'

export default async function page() {
    const data: any = await getExpenses();
    return (
        <div>
            <ListExpensesShow initialData={data} />
            <TestAddExpense />
        </div>
    )
}
