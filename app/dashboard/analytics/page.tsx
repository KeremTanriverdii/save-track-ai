import { Suspense } from 'react';
import { cookies } from 'next/headers';
import { transformToDailyChart } from './action';
import { calTotal } from '@/lib/analytics/calcTotal';
import { calcTopCategorySpending } from '@/lib/analytics/calcTopCategory';
import { calcAverage } from '@/lib/analytics/calcAverage';
import { Expense } from '@/lib/types/type';
import MonthSelectClientComponent from '@/components/Client/MonthSelectClientComponent';
import { ChartAnalytics } from '@/components/Client/Charts/ChartAnalytics';
import InsightPanelComponent from '@/components/InsightPanelComponent';

async function getAnalyticsData(month: string) {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');

    try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const res = await fetch(`${baseUrl}/api/expenses?yearMonth=${month}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(sessionCookie && { Cookie: `${sessionCookie.name}=${sessionCookie.value}` }),
            },
            next: {
                revalidate: 60,
                tags: [`expenses-${month}`]
            }
        });

        if (!res.ok) throw new Error('Failed to fetch expenses');

        const rawData: Expense[] = await res.json();
        const dailyData = await transformToDailyChart(rawData, month);
        return {
            rawData,
            dailyData,
            totalSpending: calTotal(dailyData),
            averageSpending: calcAverage(dailyData),
            mostSpendingCategory: calcTopCategorySpending(rawData),
        };

    } catch (error) {
        console.error("Data fetch error:", error);
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
                <h1 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h1>
                <MonthSelectClientComponent />
            </div>
            {analyticsData ? (
                <div>
                    <ChartAnalytics initialData={{ ...analyticsData }} />
                    <InsightPanelComponent initialData={analyticsData.rawData} chartsData={{ ...analyticsData }} />
                </div>
            ) : (
                <div className="p-4 border border-red-500/50 rounded bg-red-500/10 text-red-200">
                    Failed to load analytics data. Please try again later.
                </div>
            )}

        </div>
    );
}