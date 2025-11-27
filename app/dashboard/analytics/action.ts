'use server';

import { calTotal } from '@/lib/analytics/calcTotal';
import { calcTopCategorySpending } from '@/lib/analytics/calcTopCategory';
import { calcAverage } from '@/lib/analytics/calcAverage';
import { AnalyticsData, DailyChartData, Expense } from '@/lib/types/type';




export async function transformToDailyChart(data: Expense[]): Promise<DailyChartData[]> {
    return data.reduce((acc: DailyChartData[], curr: Expense) => {
        const day = new Date(curr.createdAt?.seconds * 1000)
            .toISOString()
            .substring(0, 10)

        const existing = acc.find((item) => item.day === day)

        if (existing) existing.amount += curr.amount
        else acc.push({ day, amount: curr.amount })

        return acc
    }, [])
}

export async function getMonthlyAnalytics(yearMonth: string): Promise<AnalyticsData> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const fullUrl = `${baseUrl}/api/expenses?yearMonth=${yearMonth}`;

    const res = await fetch(fullUrl, {
        cache: 'no-store'
    });

    if (!res.ok) {
        console.error(`API isteği başarısız oldu: ${res.status}`);
        return {
            dailyData: [],
            totalSpending: 0,
            averageSpending: 0,
            mostSpendingCategory: null,
        }
    }

    const rawData: Expense[] = await res.json();

    const dailyData = await transformToDailyChart(rawData);
    const totalSpending = calTotal(dailyData);
    const topCategory = calcTopCategorySpending(rawData);
    const averageSpending = calcAverage(dailyData);

    return {
        dailyData,
        totalSpending,
        averageSpending,
        mostSpendingCategory: topCategory,
    };
}