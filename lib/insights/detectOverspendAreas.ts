
import { Expense } from "../types/type";

export interface OverSpendArea {
    date: Date;
    amount: number;
    isExceeded: boolean;
    percentageExceeded: number;
    title: string;
    category: string;
    threshold: number;
    expenseId: [];
}
interface GroupedByDate {
    [key: string]: {
        date: Date;
        amount: number;
        categories: string[];
    };
}
export function detectOverspendAreas(expenses: Expense[], monthlyBudget?: number) {
    if (!expenses || !monthlyBudget || expenses.length === 0) return [];
    const DAILY_LIMIT = monthlyBudget / 30;
    const THRESHOLD = DAILY_LIMIT * 1.2;

    const groupedByDate: GroupedByDate = expenses.reduce((acc: any, curr: Expense) => {
        const dateKey = (curr.date as { seconds: number }).seconds ?
            new Date((curr.date as { seconds: number }).seconds * 1000).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
            }) : new Date(curr.date as any).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
                day: "numeric",
            });

        if (!acc[dateKey]) {
            acc[dateKey] = { date: dateKey, amount: 0, categories: [], expenseId: [] };
        }
        acc[dateKey].amount += curr.amount;
        if (!acc[dateKey].categories.includes(curr.category)) {
            acc[dateKey].categories.push(curr.category);
            acc[dateKey].expenseId.push(curr.id);
        }
        return acc;
    }, {});

    return Object.values(groupedByDate).map((item: GroupedByDate[string]) => {
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
        } as OverSpendArea;
    })
        .filter(item => item.isExceeded)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

}
