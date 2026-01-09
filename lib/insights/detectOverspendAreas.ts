
import { ReturnAPIResponseData } from "../types/type";

export interface OverSpendArea {
    date: Date;
    amount: number;
    isExceeded: boolean;
    percentageExceeded: number;
    title: string;
    category: string;
    threshold: number;
    expenseId: [];
    currency?: string
}
interface GroupedByDate {
    [key: string]: {
        date: string;
        amount: number;
        categories: string[];
        expenseId: string[];
    };
}
export function detectOverspendAreas(expenses: ReturnAPIResponseData[], monthlyBudget?: number) {
    if (!expenses || !monthlyBudget || expenses.length === 0) return [];

    const dayInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    const DAILY_LIMIT = monthlyBudget / dayInMonth;
    const THRESHOLD = DAILY_LIMIT * 1.2;

    const groupedByDate: GroupedByDate = expenses.reduce<Record<string, { date: string; amount: number; categories: string[], expenseId: string[] }>>((acc, curr: ReturnAPIResponseData) => {
        const dateKey = (curr.date as { seconds: number }).seconds ?
            new Date((curr.date as { seconds: number }).seconds * 1000).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
            }) : new Date((curr.date as { seconds: number }).seconds * 1000).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
                day: "numeric",
            });

        if (!acc[dateKey]) {
            acc[dateKey] = { date: dateKey, amount: 0, categories: [], expenseId: [] };
        }

        acc[dateKey].amount += curr.amount;
        acc[dateKey].expenseId.push(curr.id);

        if (!acc[dateKey].categories.includes(curr.category as unknown as string)) {
            acc[dateKey].categories.push(curr.category as unknown as string);
        }
        return acc;
    }, {});

    return Object.values(groupedByDate).map((item: GroupedByDate[string]) => {
        const isExceeded = item.amount > THRESHOLD;
        const percentageExceeded = isExceeded
            ? Math.round(((item.amount - THRESHOLD) / DAILY_LIMIT) * 100)
            : 0;

        return {
            date: item.date,
            amount: item.amount,
            isExceeded,
            percentageExceeded,
            title: `Daily Limit Exceeded: ${item.amount}`,
            category: item.categories.join(', '),
            threshold: DAILY_LIMIT,
            expenseId: item.expenseId,
        } as unknown as OverSpendArea;
    })
        .filter(item => item.isExceeded)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

}
