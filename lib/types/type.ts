export interface Expense {
    id: any,
    amount: number,
    category: string,
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

export interface AllData {
    analyticsData: AnalyticsData,
    anomalies: DetectAnomalies[];
    detectOverspendAreas: IsSpike[];
    detectWeeklyTrend: ChangeRate[];
    dailyData: DailyChartData[]
}