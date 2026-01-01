
"use client"
import * as React from "react"
import { Progress } from "@/components/ui/progress"
interface Props {
    budgetMonth: number;
    totalMonth: number;
    remaining: number;
    rDiff: number;
    rCurrency: string;
}

export default function ProgressRemaining({ budgetMonth, totalMonth, remaining, rDiff, rCurrency }: Props) {
    const [progress, setProgress] = React.useState(10)

    const spentPercentage = budgetMonth > 0
        ? Math.min(100, Math.round((totalMonth / budgetMonth) * 100))
        : 0;

    const remainingPercentage = 100 - spentPercentage;

    React.useEffect(() => {
        const timer = setTimeout(() => setProgress(spentPercentage), 100);
        return () => clearTimeout(timer);
    }, [spentPercentage])


    return <Progress value={progress} className="w-full" indicatorClassName={spentPercentage >= 75 ? "bg-orange-500" : spentPercentage >= 85 ? "bg-red-500" : "bg-primary"} />
}
