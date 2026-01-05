"use client"

import { AllData, DailyChartData } from "@/lib/types/type";
import { Button } from "../ui/button"

interface ButtonAiComponentProps {
    requestData: {
        dailyData: DailyChartData[];
        monthlyBudget: any;
        totalSpending: number;
        averageSpending: number;

        mostSpendingCategory: Record<string, number> | null;
        overSpends: { date: string, amount: number; isExceeded: boolean, percentageExceeded: number; title: string; category: string; threshold: number }[];
    } | null,

    currentMonth: {
        monthId: string;
        budget: number,
        currency: string;
        totalMonth: number;
        monthlySpend: number;
        remaining: number;
    }
}

export default function ButtonAiComponent({ requestData, currentMonth }: AllData) {
    const analytics = requestData;
    const handleSubmitAi = async () => {
        const response = await fetch('/api/ai/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ analytics }),
        })
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data
    }
    return (
        <Button onClick={handleSubmitAi}> Ai with insights</Button>
    )
}
