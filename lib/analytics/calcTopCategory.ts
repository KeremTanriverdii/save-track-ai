import { Expense, ReturnAPIResponseData } from "../types/type";

export const calcTopCategorySpending = (data: ReturnAPIResponseData[]): Record<string, number> | null => {
    if (data.length === 0) return null;
    const nameCategoryofMostSpend = data.reduce((acc, curr) => {
        if (curr.category) {
            acc[curr.category as unknown as string] = (acc[curr.category as unknown as string] || 0) + curr.amount;
        }
        return acc;
    }, {} as Record<string, number>);

    if (Object.keys(nameCategoryofMostSpend).length === 0) return null;

    const topEntry = Object.entries(nameCategoryofMostSpend).reduce((max, current) => {
        return current[1] > max[1] ? current : max;
    })
    return { [topEntry[0]]: topEntry[1] };
}
type CategoryTotals = Record<string, number>;


export const getCategoryAndTotalAmount = (data: Expense[]) => {
    if (data.length === 0) return null;
    const categoryTotals = data.reduce<CategoryTotals>((acc, curr) => {
        const category = curr.category;
        if (category) {
            acc[category as string] = (acc[category] || 0) + curr.amount;
        }
        return acc;
    }, {
    });
    return categoryTotals;

}