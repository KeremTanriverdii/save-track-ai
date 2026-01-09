"use client"

import { ButtonAiComponentProps } from "@/lib/types/type";
import { Button } from "../ui/button"
import { Bot, Loader2 } from "lucide-react";
import { useTransition } from "react";


export default function ButtonAiComponent({ requestData, currentMonth }: ButtonAiComponentProps) {
    const analytics = requestData;
    const curMonth = currentMonth
    const [isPending, startTransition] = useTransition();
    const updateAnalytics = {
        ...analytics,
        dailyData: analytics?.dailyData.filter(isHaveAmount => isHaveAmount.amount > 0),
    }
    const handleSubmitAi = () => {
        startTransition(async () => {
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
        })
    }
    return (
        <Button onClick={handleSubmitAi} className="absolute bottom-5 right-5 hover:scale-110 hover:ease-in-out duration-300">{isPending ?
            <div className="flex items-center gap-2 ">
                <Loader2 className="animate-spin" /> Loading...</div>
            :
            <div className="flex items-center gap-2"><Bot /> Ai with insights</div>}
        </Button>
    )
}
