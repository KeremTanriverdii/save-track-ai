import { DailyChartData } from "../types/type";

export const calTotal = (data: DailyChartData[]): number => {
    if (!data) return 0
    const totalAmount = data.reduce((a, b) => a + b.amount, 0);
    return totalAmount
}