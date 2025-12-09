import { detectAnomalies } from '@/lib/insights/detectAnomalies'
import { detectOverspendAreas } from '@/lib/insights/detectOverspendAreas'
import { detectWeeklyTrend } from '@/lib/insights/detectWeeklyTrend'
import { AllData, AnalyticsData, DailyChartData, Expense } from '@/lib/types/type'
import { Button } from './ui/button'
import ButtonAiComponent from './Client/ButtonAiComponent'
import { getCategoryAndTotalAmount } from '@/lib/analytics/calcTopCategory'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

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
    const categoryTotals: any = getCategoryAndTotalAmount(initialData);

    const dailyCharts = initialData.map((x: Expense) => {
        const date = new Date(x.createdAt.seconds * 1000);
        const day = date.getDate();
        return {
            day,
            amount: x.amount
        }
    }) as unknown as DailyChartData[]
    const y = detectAnomalies(dailyCharts as unknown as DailyChartData[])

    const allDataOneVariable: AllData = {
        summary: chartsDataWithoutDailyData,
        categoryTotals: categoryTotals,
        daily: dailyCharts,
        anomalies: y.filter((item) => item.isAnomaly === true),
        trend: changeRate.filter((item) => item.isRising === true),
    }

    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2 '>
            <Card>
                <CardHeader>
                    <CardTitle>Your Trend</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul>
                        {changeRate.map((item, index: number) => (
                            <li key={index}>
                                Week: {item.week} - {item.changeRate}% - {item.isRising ? 'Rising' : 'Falling'}
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>


            {changeRate.map((item, index: number) => (
                <Card key={index}>
                    <CardContent>
                        Your Trend With Spend<br />
                        <ul>
                            <li key={index}>Change Rate Week: {item.week} - {item.changeRate}% - {item.isRising ? 'Rising' : 'Falling'} - total: {item.total}</li>
                        </ul>
                    </CardContent>
                </Card>
            ))}

            {detect.filter((item) => item.spike === true).map((item, index: number) => (
                <Card key={index}>
                    <CardContent>
                        Your Overspends Area <br />
                        <ul className='mt-2'>
                            <li>Amount: {item.amount} - Day: {item.day}</li>
                        </ul>
                    </CardContent>
                </Card>
            ))}

            {y.filter((item) => item.isAnomaly === true).map((item, index: number) => (
                <Card key={index} className='flex flex-col gap-3'>
                    <CardContent>
                        Your Anomalies <br />
                        <ul className=''>
                            <li>Amount: {item.amount} - Day: {item.day}</li>
                        </ul>
                        You're mean: {item.stats.mean} and std: {item.stats.threshold} <br />
                        Spend's day: {item.day} and amount: {item.amount}
                    </CardContent>
                </Card>
            ))
            }
            <Card>
                <CardHeader>
                    <CardTitle>Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    You most spends Category: {chartsDataWithoutDailyData.mostSpendingCategory ? Object.keys(chartsDataWithoutDailyData.mostSpendingCategory)[0] : 'N/A'}
                    <br />
                    Total Category Spend: {chartsDataWithoutDailyData.mostSpendingCategory ? Object.values(chartsDataWithoutDailyData.mostSpendingCategory)[0] : 'N/A'}
                </CardContent>
            </Card>

            <div className='fixed bottom-5 right-3'>
                <ButtonAiComponent requestData={allDataOneVariable} />
            </div>
        </div>
    )
}
