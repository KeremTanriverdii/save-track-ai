import { cookies } from 'next/headers';
import { transformToDailyChart } from './action';
import { calTotal } from '@/lib/analytics/calcTotal';
import { calcTopCategorySpending } from '@/lib/analytics/calcTopCategory';
import { calcAverage } from '@/lib/analytics/calcAverage';
import { Expense } from '@/lib/types/type';
import MonthSelectClientComponent from '@/components/Client/MonthSelectClientComponent';
import { ChartAnalytics } from '@/components/Client/Charts/ChartAnalytics';
import InsightPanelComponent from '@/components/InsightPanelComponent';
import BudgetState from '@/components/Client/Budget/BudgetStateComponent';
import { Card, CardAction, CardContent } from '@/components/ui/card';


async function getAnalyticsData(month: string) {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    const headers = {
        'Content-Type': 'application/json',
        ...(sessionCookie && { Cookie: `${sessionCookie.name}=${sessionCookie.value}` }),
    };

    try {
        const [expensesRes, budgetRes] = await Promise.all([
            fetch(`${baseUrl}/api/expenses?yearMonth=${month}`, { headers, next: { revalidate: 60, tags: [`expenses-${month}`] } }),
            fetch(`${baseUrl}/api/budget`, { headers, next: { revalidate: 300 } })
        ]);

        if (!expensesRes.ok || !budgetRes.ok) throw new Error('Fetch error');

        const rawData: Expense[] = await expensesRes.json();
        const monthlyBudget = await budgetRes.json();

        const dailyData = await transformToDailyChart(rawData, month);
        return {
            rawData,
            dailyData,
            monthlyBudget,
            totalSpending: calTotal(dailyData),
            averageSpending: calcAverage(dailyData),
            mostSpendingCategory: calcTopCategorySpending(rawData),
            overSpends: monthlyBudget.overSpends,
        };

    } catch (error) {
        console.error("Fetch error", error);
        return null;
    }
}

export default async function AnalyticsPage(props: {
    searchParams: Promise<{ yearMonth?: string }>;
}) {
    const searchParams = await props.searchParams;

    const currentMonth = searchParams.yearMonth || new Date().toISOString().substring(0, 7);
    const analyticsData = await getAnalyticsData(currentMonth);
    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className='w-full'>
                    <BudgetState total={analyticsData?.totalSpending ?? 0} />
                </div>
                <Card className=''>
                    <CardContent>
                        <p className='mb-6'>
                            You can select the month and year for analyzing data within the chosen range.
                        </p>
                        <CardAction>
                            <MonthSelectClientComponent />
                        </CardAction>
                    </CardContent>
                </Card>
            </div>
            {analyticsData ? (
                <div>
                    <ChartAnalytics initialData={{ ...analyticsData }} />
                    <InsightPanelComponent
                        initialData={analyticsData.rawData}
                        chartsData={{ ...analyticsData }}
                        overSpendsReports={analyticsData.overSpends}
                    />
                </div>
            ) : (
                <div className="p-4 border border-red-500/50 rounded bg-red-500/10 text-red-200">
                    Failed to load analytics data. Please try again later.
                </div>
            )}

        </div>
    );
}