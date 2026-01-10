import DataTableClientComponent from '@/components/Client/DataTableClientComponent';
import { getUserData } from '@/lib/auth/user';
import { getExpenses } from '@/lib/expenses/getExpense'
import { runLazySubscriptionCheck } from '@/lib/expenses/runLazySubscriptionCheck';
import { ReturnAPIResponseData } from '@/lib/types/type';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Expenses",
    description: "Expenses page",
};

export default async function page() {
    const user = await getUserData()
    const userId = user?.uid as string

    if (userId) {
        await runLazySubscriptionCheck(userId);
    }

    const rawData: ReturnAPIResponseData[] = await getExpenses(userId);

    if (!rawData) {
        throw new Error('No data found')
    }
    return <DataTableClientComponent data={rawData} />
}
