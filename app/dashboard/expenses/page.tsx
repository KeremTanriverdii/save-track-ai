import DataTableClientComponent from '@/components/Client/DataTableClientComponent';
import { getUserData } from '@/lib/auth/user';
import { getExpenses } from '@/lib/expenses/getExpense'
import { runLazySubscriptionCheck } from '@/lib/expenses/runLazySubscriptionCheck';
import { Expense, Expenses, ReturnAPIResponseData } from '@/lib/types/type';

export default async function page() {
    const user = await getUserData()
    const userId = user?.uid as string

    if (userId) {
        await runLazySubscriptionCheck(userId);
    }

    const rawData: Expense[] = await getExpenses(userId);

    if (!rawData) {
        throw new Error('No data found')
    }

    console.log('raw', rawData)
    const data: Expenses[] = rawData.map(expense => ({
        ...expense,
        date: expense.date as any,
        createdAt: null,
    }));

    const serializeData: ReturnAPIResponseData[] = JSON.parse(JSON.stringify(data))
    console.table(serializeData.map(item => item.subscriptionDetails))
    return <DataTableClientComponent data={serializeData} />
}
