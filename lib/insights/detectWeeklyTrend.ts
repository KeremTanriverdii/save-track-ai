export interface WeeklyTrendResult {
    week: string;
    total: number;
    changeRate: number;
    isRising: boolean;
    impactAmount: number;
    status: 'Stabilizing' | 'Critical' | 'Good' | 'Neutral';
    insight: string;
    isBaseline?: boolean;
}

import { Expense } from "../types/type";

export function detectWeeklyTrend(expenses: Expense[]): WeeklyTrendResult[] {
    if (!expenses || expenses.length === 0) return [];


    const weeklyTotals: Record<number, number> = {};
    expenses.forEach((expense) => {
        const date = typeof expense.date === 'object' && 'seconds' in expense.date
            ? new Date((expense.date as any).seconds * 1000)
            : new Date(expense.date);

        const weekNumber = getWeekNumber(date);
        weeklyTotals[weekNumber] = (weeklyTotals[weekNumber] || 0) + expense.amount;
    });

    const sortedWeeks = Object.entries(weeklyTotals)
        .sort((a, b) => Number(a[0]) - Number(b[0]));


    return sortedWeeks.map((currentWeekData, index) => {
        const currentWeekNum = Number(currentWeekData[0]);
        const currentTotal = currentWeekData[1];


        if (index === 0) {
            return {
                week: `Week ${currentWeekNum}`,
                total: currentTotal,
                changeRate: 0,
                isRising: false,
                impactAmount: 0,
                status: 'Neutral',
                insight: 'Baseline data established.',
                isBaseline: true
            };
        }


        const previousWeekData = sortedWeeks[index - 1];
        const previousTotal = previousWeekData[1];


        const rawChange = ((currentTotal - previousTotal) / previousTotal) * 100;
        const changeRate = Number(rawChange.toFixed(1));


        const impactAmount = previousTotal - currentTotal;
        const isRising = changeRate > 0;


        let status: WeeklyTrendResult['status'] = 'Neutral';
        let insight = '';

        if (Math.abs(changeRate) < 1) {
            status = 'Stabilizing';
            insight = 'Spending is stabilizing. Maintain this to recover budget.';
        } else if (isRising && changeRate > 10) {
            status = 'Critical';
            insight = 'Significant spending spike detected compared to last week.';
        } else if (!isRising) {
            status = 'Good';
            insight = 'Good job! You are spending less than last week.';
        } else {
            status = 'Neutral';
            insight = 'Spending trends are consistent with usual patterns.';
        }

        return {
            week: `Week ${currentWeekNum}`,
            total: currentTotal,
            changeRate: Math.abs(changeRate),
            isRising: isRising,
            impactAmount: impactAmount,
            status: status,
            insight: insight,
            isBaseline: false
        };
    });
}


function getWeekNumber(d: Date): number {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}