import { detectAnomalies } from '@/lib/insights/detectAnomalies'
import { detectOverspendAreas } from '@/lib/insights/detectOverspendAreas'
import { detectWeeklyTrend } from '@/lib/insights/detectWeeklyTrend'
import { DailyChartData, Expense } from '@/lib/types/type'

export default function InsightPanelComponent({
    initialData,
}:
    {
        initialData: Expense[],
        dailyData?: DailyChartData[],
        currentMonth?: string | undefined
    }) {
    const changeRate = detectWeeklyTrend(initialData)
    const detect = detectOverspendAreas(initialData)
    const x = initialData.map((x: any) => {
        const date = new Date(x.createdAt.seconds * 1000);
        const day = date.getDate();
        return {
            day,
            amount: x.amount as number
        }
    })
    // x as any will be fix type's
    const y = detectAnomalies(x as any)
    return (
        <div>
            12 <br />
            {initialData.map((x: any) => x.description)}
        </div>
    )
}
