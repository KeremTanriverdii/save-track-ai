import { Expense } from "../types/type";

export const calcTopCategorySpending = (data: Expense[]): Record<string, number> | null => {
    if (data.length === 0) return null;
    const nameCategoryofMostSpend = data.reduce((acc, curr) => {
        if (curr.category) {
            acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
        }
        return acc;
    }, {} as Record<string, number>);

    if (Object.keys(nameCategoryofMostSpend).length === 0) return null;

    const topEntry = Object.entries(nameCategoryofMostSpend).reduce((max, current) => {
        return current[1] > max[1] ? current : max;
    })
    // console.log(nameCategoryofMostSpend)
    return { [topEntry[0]]: topEntry[1] };
}