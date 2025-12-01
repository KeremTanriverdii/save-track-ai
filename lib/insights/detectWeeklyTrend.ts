import { Expense } from "../types/type";

export function detectWeeklyTrend(expenses: Expense[]) {
    if (!expenses || expenses.length === 0) return [];
    const map: Record<string, number> = {};

    // Calculate the total weekly
    const weeklyTotals: Record<number, number> = {};

    expenses.forEach((expense: Expense) => {
        const date = new Date(expense.createdAt.seconds * 1000);
        const weekNumber = getWeekNumber(date);
        weeklyTotals[weekNumber] = (weeklyTotals[weekNumber] || 0) + expense.amount;
    });

    // sort the total expenses to week number
    const sortedWeeks = Object.entries(weeklyTotals)
        .sort((a, b) => Number(a[0]) - Number(b[0]));

    // 
    const trendResults = sortedWeeks.map((currentWeekData, index) => {
        if (index === 0) {
            return {
                week: Number(currentWeekData[0]),
                total: currentWeekData[1],
                isRising: false,
                changeRate: 0
            }
        }
        const previousWeekData = sortedWeeks[index - 1];
        const currentTotal = currentWeekData[1];
        const previousTotal = previousWeekData[1];
        // Calcucate the change rate 
        const changeRate = ((currentTotal - previousTotal) / previousTotal)

        return {
            week: 'Week' + Number(currentWeekData[0]),
            total: currentTotal,
            isRising: changeRate > 0,
            changeRate: Number(changeRate.toFixed(2))
        }
    })
    return trendResults
}

function getWeekNumber(d: Date): number {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));

    var weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    return weekNo;

}
