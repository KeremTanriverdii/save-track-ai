import { detectAnomalies } from '@/lib/insights/detectAnomalies'
import { detectOverspendAreas } from '@/lib/insights/detectOverspendAreas'
import { detectWeeklyTrend } from '@/lib/insights/detectWeeklyTrend'
import { ChangeRate, DailyChartData, Expense } from '@/lib/types/type'

export default function InsightPanelComponent({
    initialData,
}:
    {
        initialData: Expense[],
        dailyData?: DailyChartData[],
        currentMonth?: string | undefined
    }) {
    const changeRate = detectWeeklyTrend(initialData);
    console.log(changeRate)
    const detect = detectOverspendAreas(initialData)
    const x = initialData.map((x: Expense) => {
        const date = new Date(x.createdAt.seconds * 1000);
        const day = date.getDate();
        return {
            day,
            amount: x.amount
        }
    })
    const y = detectAnomalies(x as unknown as DailyChartData[])
    return (
        <div>
            12 <br />
            <ul>{changeRate.map((item, index: number) => (
                <li key={index}>Change Rate Week: {item.week} - {item.changeRate}% - {item.isRising ? 'Rising' : 'Falling'} - total: {item.total}</li>
            ))}</ul>

            {detect.filter((item) => item.spike === true).map((item, index: number) => (
                <div key={index}>You're Overspends Area <br />
                    <ul>
                        <li>Amount: {item.amount} - Day: {item.day}</li>
                    </ul>
                </div>
            ))}

            {detect.filter((item) => item.spike === false) && (
                <div>No Overspends Area</div>
            )}

            {y.filter((item) => item.isAnomaly === true).map((item, index: number) => (
                <div key={index} className='flex flex-col gap-3 bg-amber-600'>
                    You're Anomaly Spends
                    <ul className=''>
                        <li>Amount: {item.amount} - Day: {item.day}</li>
                    </ul>
                    You're mean: {item.stats.mean} and std: {item.stats.threshold} <br />
                    Spend's day: {item.day} and amount: {item.amount}
                </div>
            ))
            }

            {y.filter((item) => item.isAnomaly === false) && (
                <div>No Anomaly Spends</div>
            )}
        </div>
    )
}
