"use client"

import { AllData } from "@/lib/types/type";
import { Button } from "../ui/button"


export default function ButtonAiComponent({ requestData }: { requestData: AllData }) {
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
