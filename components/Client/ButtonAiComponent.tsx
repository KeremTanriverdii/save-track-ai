"use client"

import { ButtonAiComponentProps } from "@/lib/types/type";
import { Button } from "../ui/button"
import { Bot } from "lucide-react";


export default function ButtonAiComponent({ requestData, currentMonth }: ButtonAiComponentProps) {
    const analytics = requestData;
    const curMonth = currentMonth

    const updateAnalytics = {
        ...analytics,
        dailyData: analytics?.dailyData.filter(isHaveAmount => isHaveAmount.amount > 0),
    }
    const handleSubmitAi = async () => {
        const response = await fetch('/api/ai/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ requestData: updateAnalytics, currentMonth: curMonth }),
        })
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data
    }
    return (
        <Button onClick={handleSubmitAi} className="absolute bottom-5 right-5 hover:scale-110 hover:ease-in-out duration-300"><Bot />  Ai with insights</Button>
    )
}
