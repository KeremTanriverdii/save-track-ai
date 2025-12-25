import { detectAnomalies } from '@/lib/insights/detectAnomalies'
import { detectOverspendAreas, OverSpendArea } from '@/lib/insights/detectOverspendAreas'
import { detectWeeklyTrend } from '@/lib/insights/detectWeeklyTrend'
import { AllData, AnalyticsData, DailyChartData, Expense, User } from '@/lib/types/type'
import { getCategoryAndTotalAmount } from '@/lib/analytics/calcTopCategory'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { TrendingDownIcon, TriangleAlert } from 'lucide-react'
import { CriticalCard } from './CriticalCard'

export default async function InsightPanelComponent({
    initialData,
    chartsData,
    overSpendsReports
}:
    {
        initialData: Expense[],
        chartsData: AnalyticsData,
        overSpendsReports: OverSpendArea[]
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
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl">
                <CardHeader className="pb-2">
                    <CardTitle className='flex items-center gap-3 text-lg font-medium'>
                        <div className='p-2.5 rounded-xl bg-blue-500/20 backdrop-blur-md border border-blue-500/20'>
                            <TrendingDownIcon className="w-5 h-5 text-blue-400" />
                        </div>
                        <span>Weekly Trend</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-3">
                        {changeRate.map((item, index) => (
                            <li key={index} className="flex justify-between items-center text-sm p-2 rounded-lg bg-white/5">
                                <span className="text-muted-foreground">Week {item.week}</span>
                                <span className={item.isRising ? 'text-red-400' : 'text-emerald-400 font-medium'}>
                                    {item.isRising ? '↑' : '↓'} {item.changeRate}%
                                </span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>

            {overSpendsReports.length > 0 ? (
                <Card className='md:col-span-2 bg-white/5 backdrop-blur-xl border-white/10 overflow-hidden'>
                    <CardHeader>
                        <CardTitle className='flex gap-3 items-center'>
                            <div className='bg-red-500/20 p-2.5 rounded-xl border border-red-500/20'>
                                <TriangleAlert className="w-5 h-5 text-red-400" />
                            </div>
                            <h2 className='text-xl font-semibold'>Critical Overspend Areas</h2>
                        </CardTitle>
                        <p className='text-xs text-muted-foreground mt-1 italic'>
                            Daily limit threshold: <span className="text-white font-mono">{overSpendsReports[0].threshold.toFixed(0)}₺</span>
                        </p>
                    </CardHeader>
                    <CardContent>
                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar'>
                            {overSpendsReports.map((report, index) => (
                                <CriticalCard
                                    percentage={0} key={index}
                                    {...report}
                                />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card className='md:col-span-2 flex items-center justify-center border-dashed border-white/10 bg-white/5'>
                    <CardContent className="text-muted-foreground py-10">
                        ✅ Everything looks stable for this period.
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
