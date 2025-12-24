import { detectAnomalies } from '@/lib/insights/detectAnomalies'
import { detectOverspendAreas, OverspendArea } from '@/lib/insights/detectOverspendAreas'
import { detectWeeklyTrend } from '@/lib/insights/detectWeeklyTrend'
import { AllData, AnalyticsData, DailyChartData, Expense, User } from '@/lib/types/type'
import { getCategoryAndTotalAmount } from '@/lib/analytics/calcTopCategory'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { TrendingDownIcon } from 'lucide-react'
import { CriticalCard } from './CriticalCard'

export default async function InsightPanelComponent({
    initialData,
    chartsData,
    overSpendsReports
}:
    {
        initialData: Expense[],
        chartsData: AnalyticsData,
        overSpendsReports: OverspendArea[]
    }) {

    const { dailyData, rawData, ...chartsDataWithoutDailyData } = chartsData;
    const changeRate = detectWeeklyTrend(initialData);
    const detect = detectOverspendAreas(initialData)
    const categoryTotals: any = getCategoryAndTotalAmount(initialData);


    const dailyCharts = initialData.map((x: Expense) => {
        const date = typeof x.date === 'object' && 'seconds' in x.date
            ? new Date((x.date as { seconds: number }).seconds * 1000)
            : new Date(x.date);
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
                    <CardTitle className='flex items-center gap-4'>
                        <div className='p-4 rounded-full bg-blue-500/30 flex items-center justify-center '>
                            <TrendingDownIcon color='aqua' />
                        </div>
                        <h2>
                            Weekly Trend
                        </h2>
                    </CardTitle>
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

            {/* {overSpendsReports.map((report, index) => (
                <CriticalCard
                    key={`${report.category}-${index}`}
                    date={report.date}
                    category={report.category}
                    amount={report.amount}
                    percentage={report.percentageExceeded}
                />
            ))} */}

        </div>
    )
}
