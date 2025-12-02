import { transformToDailyChart } from "@/app/dashboard/analytics/action";
import { AnalyticsData, DailyChartData, Expense, IsSpike } from "../types/type";

export function detectOverspendAreas(expenses: Expense[]) {
    if (!expenses || expenses.length === 0) return [];
    const daily = expenses.map((expense: Expense) => {
        const date = new Date(expense.createdAt.seconds * 1000);
        const day = date.getDate();
        return {
            day,
            amount: expense.amount
        }
    })
    const HIGH_EXPENSE_THRESHOLD = 3000;


    function findIsSpike(day: { day: number; amount: number; }) {
        return {
            ...day,
            spike: day.amount > HIGH_EXPENSE_THRESHOLD
        }
    }

    const x = daily.map(findIsSpike)
    return x as IsSpike[]

}
