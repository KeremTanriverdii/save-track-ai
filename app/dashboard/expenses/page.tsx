import ListExpensesShow from '@/components/Client/ListExpensesShow';
import TestAddExpense from '@/components/Client/TestAddExpense'
import { getUserData } from '@/lib/auth/user';
import { getExpenses } from '@/lib/expenses/getExpense'
import { User } from '@/lib/types/type';

export default async function page() {
    const user = await getUserData()
    const userId = user?.uid as string
    const data: any = await getExpenses(userId);
    return (
        <div>
            <ListExpensesShow initialData={data} />
            <TestAddExpense />
        </div>
    )
}
