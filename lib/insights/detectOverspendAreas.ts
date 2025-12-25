
import { Expense } from "../types/type";

export interface OverSpendArea {
    date: string;
    amount: number;
    isExceeded: boolean;
    percentageExceeded: number;
    title: string;
    category: string;
    threshold: number;
}

export function detectOverspendAreas(expenses: Expense[], monthlyBudget?: number) {
    if (!expenses || !monthlyBudget || expenses.length === 0) return [];
    const DAILY_LIMIT = monthlyBudget / 30;
    const THRESHOLD = DAILY_LIMIT * 1.2;

    const groupedByDate = expenses.reduce((acc: any, curr: Expense) => {
        const dateKey = (curr.date as { seconds: number }).seconds ? new Date((curr.date as { seconds: number }).seconds * 1000).toDateString() : (curr.date as any).toDateString();

        if (!acc[dateKey]) {
            acc[dateKey] = { date: dateKey, amount: 0, categories: [] };
        }
        acc[dateKey].amount += curr.amount;
        if (!acc[dateKey].categories.includes(curr.category)) {
            acc[dateKey].categories.push(curr.category);
        }
        return acc;
    }, {});

    return Object.values(groupedByDate).map((item: any) => {
        const isExceeded = item.amount > THRESHOLD;
        const percentageExceeded = isExceeded
            ? Math.round(((item.amount - DAILY_LIMIT) / DAILY_LIMIT) * 100)
            : 0;

        return {
            date: item.date,
            amount: item.amount,
            isExceeded: isExceeded,
            percentageExceeded: percentageExceeded,
            title: `Daily Limit Exceeded: ${item.amount} TL`,
            category: item.categories.join(', '),
            threshold: DAILY_LIMIT,
        };
    })
        .filter(item => item.isExceeded)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

}
