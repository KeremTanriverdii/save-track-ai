import { ChartAnalytics } from '@/components/Client/Charts/ChartAnalytics'
import { getMonthlyAnalytics } from './action';
import BudgetState from '@/components/Client/Budget/BudgetStateComponent';

async function initialFetch() {
    const date = new Date().toISOString().substring(0, 7);
    const currentMonth = date

    try {
        const initialData = await getMonthlyAnalytics(currentMonth);
        return { initialData, currentMonth };
    } catch (error) {
        console.error("İlk veri çekme hatası:", error);
        return {
            initialData: {
                dailyData: [],
                totalSpending: 0,
                averageSpending: 0,
                mostSpendingCategory: null
            },
            currentMonth
        };
    }
}

export default async function page() {
    const { initialData, currentMonth } = await initialFetch();

    return (
        <div >
            {/* Server'da çekilen veriyi Client Component'e prop olarak geçiriyoruz */}
            <ChartAnalytics initialData={initialData} currentMonth={currentMonth} />
            <div>InsightPanel server</div>
        </div>
    )
}