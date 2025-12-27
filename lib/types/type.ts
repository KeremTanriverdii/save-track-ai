export interface Expense {
    id: string,
    amount: number,
    category: string,
    description?: string,
    title?: string,
    createdAt: {
        seconds: number,
        nanoseconds: number
        id?: string
    }
    date: {
        seconds: number,
        nanoseconds: number
    }
}

export interface uptadeeExpense {
    amount: number,
    category: string,
    description: string
}
export interface Budget {
    budget: number,
    diff?: number,
    error?: string
    currency: string
}
export interface DailyChartData {
    day: string;
    amount: number;
    spike?: boolean;
}

export interface AnalyticsData {
    dailyData?: DailyChartData[];
    totalSpending: number;
    averageSpending: number;
    mostSpendingCategory: Record<string, number> | null;
    rawData?: Expense[];
}

export interface Budged {
    budget: number,
    id?: {
        seconds: number,
        type: string,
        nanoseconds: number
    }
}

export interface ChangeRate {
    week: string | number;
    total: number;
    isRising: boolean;
    changeRate: number;
}

export interface IsSpike {
    day: number;
    amount: number;
    spike: boolean;
}

export interface DetectAnomalies {
    isAnomaly: boolean;
    stats: {
        mean: number;
        threshold: number;
    };
    day: string;
    amount: number;
    spike?: boolean | undefined;
}
export interface categoryTotalsType {
    [category: string]: number | null;
}
export interface AllData {

    summary: AnalyticsData,
    categoryTotals: categoryTotalsType
    anomalies: DetectAnomalies[];
    daily: DailyChartData[]
    // detectOverspendAreas: IsSpike[];
    trend: ChangeRate[];
}

export interface AiResultType {
    id: string,
    createdAt: { seconds: number, nanoseconds: number },
    insight: {
        risks: [],
        patterns: [],
        suggestions: [],
        summary: []
    }
}

export interface User {
    uid: string;
    displayName: string;
    email: string;
    photoURL: string;
    createdAt?: Date;
    lastLogin: Date;
    currency: string;
}
export interface UserLog {
    uid: string;
    name: string;
    email: string;
    photoURL: string
}
export interface UserProviderProps {
    children: React.ReactNode;
    initialData: User;
}

export interface UserSettings {
    displayName: string,
    email: string,
    photoURL: string,
    currency: string,
    budget?: string;
    provider: string;
    isOAuthUser: boolean;

}

export type Expenses = {
    id: string
    amount: number
    category: string
    title?: string
    description?: string
    date: Date
}

export interface MonthlyBudget {
    budget: { budget: number, currency: string };
    remaining: { budget: number, currency: string, diff: number, error: string },
    overSpends: { date: string, amount: number; isExceeded: boolean, percentageExceeded: number; title: string; category: string; threshold: number }
}