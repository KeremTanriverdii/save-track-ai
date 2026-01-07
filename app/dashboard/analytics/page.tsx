import { cookies } from 'next/headers';
import { transformToDailyChart } from './action';
import { calTotal } from '@/lib/analytics/calcTotal';
import { calcTopCategorySpending } from '@/lib/analytics/calcTopCategory';
import { calcAverage } from '@/lib/analytics/calcAverage';
import { ReturnAPIResponseData } from '@/lib/types/type';
import MonthSelectClientComponent from '@/components/Client/MonthSelectClientComponent';
import { ChartAnalytics } from '@/components/Client/Charts/ChartAnalytics';
import InsightPanelComponent from '@/components/InsightPanelComponent';
import BudgetState from '@/components/Client/Budget/BudgetStateComponent';
import { Card, CardAction, CardContent } from '@/components/ui/card';
import ButtonAiComponent from '@/components/Client/ButtonAiComponent';
import FetchAllAndMonthlyBudget from '@/lib/expenses/totalAmount';
import { getUserData } from '@/lib/auth/user';
import { detectOverspendAreas } from '@/lib/insights/detectOverspendAreas';
import { redirect } from 'next/navigation';
import { detectAnomalies } from '@/lib/insights/detectAnomalies';

const user = await getUserData()


async function getAnalyticsData(month: string) {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    const headers = {
        'Content-Type': 'application/json',
        ...(sessionCookie && { Cookie: `${sessionCookie.name}=${sessionCookie.value}` }),
    };

    try {
        const expensesRes = await fetch(
            `${baseUrl}/api/expenses?yearMonth=${month}`, { headers, next: { revalidate: 60, tags: [`expenses-${month}`] } },
        );

        if (!expensesRes.ok) throw new Error('Fetch error');

        const rawData: ReturnAPIResponseData[] = await expensesRes.json();

        const dailyData = await transformToDailyChart(rawData, month);
        const totalSpending = calTotal(dailyData);
        const averageSpending = calcAverage(dailyData);
        const categoryTotals = calcTopCategorySpending(rawData);
        const allFromX = await FetchAllAndMonthlyBudget(user?.uid as string, month)
        const overSpends = detectOverspendAreas(rawData, allFromX?.currentMonth.budget)
        const anomalie = detectAnomalies(dailyData);
        return {
            rawData,
            dailyData,
            totalSpending,
            averageSpending,
            categoryTotals: categoryTotals || {},
            overSpends: overSpends,
            summary: {
                totalExpenses: totalSpending,
                averageExpenses: averageSpending,
                totalBudget: allFromX?.currentMonth.budget,
            },
            anomalies: anomalie.filter(anomalies => anomalies.isAnomaly === true),
            subscription: rawData.filter(expense => expense.type === 'subscription'),
            oneTimePaid: rawData.filter(expense => expense.type === 'one-time'),
            budgetsMonth: allFromX?.currentMonth
        };

    } catch (error) {
        console.error("Fetch error", error);
        return null;
    }
}


export default async function AnalyticsPage(props: {
    searchParams: Promise<{ yearMonth?: string }>;
}) {
    if (!user) redirect('/auth/login')
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

    const aiRequestData = {
        dailyData: analyticsData.dailyData,
        oneTimePaid: analyticsData.oneTimePaid,
        subscription: analyticsData.subscription,
        summary: {
            totalSpending: analyticsData.totalSpending,
            averageSpending: analyticsData.averageSpending,
            categoryTotals: analyticsData.categoryTotals ?? null,
            overSpends: analyticsData.overSpends,
            anomalies: analyticsData.anomalies,
        },
    };
    return (
        <div className="p-6 space-y-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start h-full">

                <div className="lg:col-span-2 h-full">
                    <BudgetState total={analyticsData?.totalSpending || 0} monthly={analyticsData?.budgetsMonth || null} />
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
                <ChartAnalytics initialData={analyticsData} currentMonth={analyticsData?.budgetsMonth || null} />

                <InsightPanelComponent
                    currency={analyticsData?.budgetsMonth?.currency as string}
                    initialData={analyticsData.rawData}
                    overSpendsReports={analyticsData.overSpends}
                />
            </div>
            <ButtonAiComponent requestData={aiRequestData} currentMonth={analyticsData?.budgetsMonth || undefined} />
        </div>
    );
}