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
import ButtonAiComponent from '@/components/Client/ButtonAiComponent';


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
            fetch(`${baseUrl}/api/budget?yearMonth=${month}`, { headers, next: { revalidate: 300, tags: [`budget-${month}`] } })
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

    if (!analyticsData) {
        return (
            <div className="p-6">
                <div className="p-8 border border-red-500/20 rounded-2xl bg-red-500/5 backdrop-blur-md text-red-200 text-center">
                    <h2 className="text-xl font-semibold mb-2">Data Unavailable</h2>
                    <p className="opacity-80">Failed to load analytics. Please check your connection or try again later.</p>
                </div>
            </div>
        )
    }
    return (
        <div className="p-6 space-y-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start h-full">

                <div className="lg:col-span-2 h-full">
                    <BudgetState total={analyticsData?.totalSpending || 0} />
                </div>

                <Card className="bg-white/5 backdrop-blur-lg border-white/10">
                    <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground mb-4">
                            Select period to analyze your spending habits.
                        </p>
                        <CardAction>
                            <MonthSelectClientComponent />
                        </CardAction>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                <ChartAnalytics initialData={analyticsData} />

                <InsightPanelComponent
                    currency={analyticsData.monthlyBudget.budget.currency}
                    initialData={analyticsData.rawData}
                    chartsData={analyticsData}
                    overSpendsReports={analyticsData.overSpends}
                />
            </div>
            {/* <ButtonAiComponent requestData={{...analyticsData, }} /> */}
        </div>
    );
}