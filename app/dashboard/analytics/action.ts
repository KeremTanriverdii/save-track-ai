'use server';
import { DailyChartData, ReturnAPIResponseData } from '@/lib/types/type';

export async function transformToDailyChart(data: ReturnAPIResponseData[], yearMonth: string): Promise<DailyChartData[]> {
    const [year, month] = yearMonth.split('-').map(Number);

    const daysInMonth = new Date(year, month, 0).getDate();

    const dailyMap: { [key: number]: number } = {};
    for (let i = 1; i <= daysInMonth; i++) {
        dailyMap[i] = 0;
    }
    data.forEach((curr) => {

        const dateSource = (curr.date && typeof curr.date === 'object' && 'seconds' in curr.date)
            ? new Date((curr.date as unknown as { seconds: number }).seconds * 1000)
            : new Date(curr.date);

        const dayNumber = dateSource.getDate();

        if (dailyMap[dayNumber] !== undefined) {
            dailyMap[dayNumber] += curr.amount;
        }
    });

    return Object.entries(dailyMap).map(([day, amount]) => ({
        day: day,
        amount
    })).sort((a, b) => Number(a.day) - Number(b.day));
}