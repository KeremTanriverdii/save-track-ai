'use server';
import { DailyChartData, Expense } from '@/lib/types/type';

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
