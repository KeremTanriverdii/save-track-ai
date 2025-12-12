import { transformToDailyChart } from './action';
import AnalyticsClientWrapperComponent from '@/components/Client/AnalyticsPageWrapper';
import { Expense } from '@/lib/types/type';
import { calTotal } from '@/lib/analytics/calcTotal';
import { calcTopCategorySpending } from '@/lib/analytics/calcTopCategory';
import { calcAverage } from '@/lib/analytics/calcAverage';
import { cookies } from 'next/headers';
import { Suspense } from 'react';


async function initialFetch() {
    const date = new Date().toISOString().substring(0, 7);
    const currentMonth = date
    const sessionCookie = (await cookies()).get('session')
    try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const fullUrl = `${baseUrl}/api/expenses?yearMonth=${currentMonth}`;
        const response = await fetch(fullUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(sessionCookie && { 'Cookie': `${sessionCookie.name}=${sessionCookie.value}` })
            },
            cache: 'no-store',
        })
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const rawData: Expense[] = await response.json();

        const dailyData = await transformToDailyChart(rawData);
        const totalSpending = calTotal(dailyData);
        const topCategory = calcTopCategorySpending(rawData);
        const averageSpending = calcAverage(dailyData);
        return {
            initialData: {
                rawData,
                dailyData,
                totalSpending,
                averageSpending,
                mostSpendingCategory: topCategory,
            },
            currentMonth
        };
    } catch (error) {
        console.error("First fetch error:", error);
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
        <Suspense fallback={<div>Loading...</div>}>
            <AnalyticsClientWrapperComponent initialData={initialData} currentMonth={currentMonth} />
        </Suspense>
    )
}