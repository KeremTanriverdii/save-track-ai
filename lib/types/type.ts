import { Timestamp } from "firebase-admin/firestore"

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
    type: "one-time" | "subscription";
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
    source?: 'current' | 'auto-carried' | 'default';
    isAutoCarried?: boolean;
    projectedSubs?: number;
}
export interface DailyChartData {
    day: string;
    amount: number;
    spike?: boolean;
}

export interface RemainingResponse {
    rDiff: number;
    rError: string;
    rCurrency: string;
}

export interface AnalyticsData {
    dailyData?: DailyChartData[];
    totalSpending: number;
    averageSpending: number;
    categoryTotals: Record<string, number>;
    // rawData?: Expense[];
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
    requestData: {

        requestData: {
            summary: AnalyticsData,
            categoryTotals: categoryTotalsType
            anomalies: DetectAnomalies[];
            daily: DailyChartData[]
            detectOverspendAreas: IsSpike[];
            trend: ChangeRate[];
            dailyData: DailyChartData[];
            monthlyBudget: any;
            totalSpending: number;
            averageSpending: number;

            mostSpendingCategory: Record<string, number> | null;
            overSpends: { date: string, amount: number; isExceeded: boolean, percentageExceeded: number; title: string; category: string; threshold: number }[];
        } | null,
    },

    currentMonth: {
        monthId: string;
        budget: number;
        currency: string;
        totalMonth: number;
        monthlySpend: number;
        remaining: number;
        projectedSubs: number;
        source: "current" | "auto-carried" | "default" | undefined
    } | null
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

export type SubscriptionFrequency = "monthly" | "yearly";
export type SubscriptionStatus = "active" | "cancelled";

export interface SubscriptionDetails {
    frequency: SubscriptionFrequency;
    startDate: string;
    status: SubscriptionStatus;
    billingDay: number;
    billingMonth?: number;
}

export interface ExpensePayload {
    id?: string;
    subscriptionId?: string;
    amount: number;
    category: string | string[];
    title?: string;
    description?: string;
    expenseDate: string; // ISO string
    type: "one-time" | "subscription";
    subscription?: SubscriptionDetails | null;
}

export interface ReturnAPIResponseData {
    id: string;
    title: string;
    description: string;
    date: {
        seconds: number
    };
    category: string[];
    amount: number;
    currency: string;
    type: "one-time" | "subscription";
    subscriptionDetails?: {
        frequency: string;
        startDate: string;
        status: SubscriptionStatus;
        billingDay: number;
    }
    numberOfMonthsPaid?: number;
    createdAt?: Date;
}

export interface SubscriptionCalculate {
    frequency: SubscriptionFrequency;
    totalPaidForThis?: number,
    startDate: Timestamp;
    status: "active" | "paused";
    billingDay: number;
    billingMonth?: number;
    monthlyCost: number;
    accumulatedTotal?: number;
    lastUpdated?: any;
}

export interface ChartSubsDetails {
    id: string;
    totalPaidForThis: number;
    status: string;
    category: string[];
    totalPeriodsProcessed: number;
    currency: string;
    frequency: 'monthly' | 'yearly';
    title: string;
}

export type ExpenseRow = {
    original: ReturnAPIResponseData;

};

export interface ButtonAiComponentProps {
    requestData: {
        dailyData: DailyChartData[];
        summary: {
            totalSpending: number;
            averageSpending: number;
            categoryTotals: Record<string, number> | null;
            overSpends: { date: string | unknown, amount: number; isExceeded: boolean, percentageExceeded: number; title: string; category: string; threshold: number }[];
            anomalies: DetectAnomalies[],

        } | null,
    }
    currentMonth: {
        monthId: string;
        budget: number,
        currency: string;
        totalMonth: number;
        monthlySpend: number;
        remaining: number;
        projectedSubs: number;
        source: "current" | "auto-carried" | "default" | undefined
    } | undefined
}
