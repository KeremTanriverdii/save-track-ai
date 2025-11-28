export interface Expense {
    id: any,
    amount: number,
    category?: string,
    description?: string,
    createdAt: {
        seconds: number,
        nanoseconds: number
        id?: string
    }
}

export interface uptadeeExpense {
    amount: number,
    category: string,
    description: string
}
export interface Budget {
    budget: number,
    diff: number
}
export interface DailyChartData {
    day: string;
    amount: number;
}

export interface AnalyticsData {
    dailyData: DailyChartData[];
    totalSpending: number;
    averageSpending: number;
    mostSpendingCategory: Record<string, number> | null;
}

export interface Budged {
    budget: number,
    id?: {
        seconds: number,
        type: string,
        nanoseconds: number
    }
}