import { detectAnomalies } from '@/lib/insights/detectAnomalies'
import { detectOverspendAreas } from '@/lib/insights/detectOverspendAreas'
import { detectWeeklyTrend } from '@/lib/insights/detectWeeklyTrend'
import { AllData, AnalyticsData, ChangeRate, DailyChartData, Expense } from '@/lib/types/type'
import { Button } from './ui/button'
import ButtonAiComponent from './Client/ButtonAiComponent'

export default function InsightPanelComponent({
    initialData,
    chartsData
}:
    {
        initialData: Expense[],
        chartsData: AnalyticsData
    }) {

    const { dailyData, rawData, ...chartsDataWithoutDailyData } = chartsData;
    const changeRate = detectWeeklyTrend(initialData);
    const detect = detectOverspendAreas(initialData)

    const x = initialData.map((x: Expense) => {
        const date = new Date(x.createdAt.seconds * 1000);
        const day = date.getDate();
        return {
            day,
            amount: x.amount
        }
    }) as unknown as DailyChartData[]
    const y = detectAnomalies(x as unknown as DailyChartData[])
    // const filter = chartsData.


    // This variable going to change for prepare ai format
    const allDataOneVariable: AllData = {
        analyticsData: chartsDataWithoutDailyData,
        anomalies: y.filter((item) => item.isAnomaly === true),
        detectOverspendAreas: detect.filter((item) => item.spike === true),
        detectWeeklyTrend: changeRate.filter((item) => item.isRising === true),
        dailyData: x
    }
    return (
        <div className='flex gap-5 mt-5 text-nowrap'>
            <ul >{changeRate.map((item, index: number) => (
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

            <div className='fixed bottom-5 right-3'>
                <ButtonAiComponent requestData={allDataOneVariable} />
            </div>
        </div>
    )
}
