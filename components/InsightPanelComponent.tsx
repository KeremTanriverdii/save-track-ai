import { detectAnomalies } from '@/lib/insights/detectAnomalies'
import { OverSpendArea } from '@/lib/insights/detectOverspendAreas'
import { detectWeeklyTrend } from '@/lib/insights/detectWeeklyTrend'
import { AnalyticsData, DailyChartData, Expense } from '@/lib/types/type'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { TriangleAlert } from 'lucide-react'
import { CriticalCard } from './CriticalCard'
import TrendComponent from './Client/TrendComponent'

export default async function InsightPanelComponent({
    initialData,
    chartsData,
    overSpendsReports,
    currency
}:
    {
        initialData: Expense[],
        chartsData: AnalyticsData,
        overSpendsReports: OverSpendArea[],
        currency: string
    }) {
    const trendData = detectWeeklyTrend(initialData);
    const latestData = trendData[trendData.length - 1];
    const displayData = trendData.slice(-2)
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

    const trendComponentCompoundVariable = {
        trendData: trendData,
        latestData: latestData,
        displayData: displayData
    }

    return (
        <div className='grid grid-cols-1 xl:grid-cols-3 gap-4 w-full'>

            <TrendComponent
                {...trendComponentCompoundVariable}
                currency={currency}
            />

            {overSpendsReports.length > 0 ? (
                <Card className='xl:col-span-2 bg-white/5 backdrop-blur-xl border-white/10 overflow-hidden'>
                    <CardHeader>
                        <CardTitle className='flex gap-3 items-center'>
                            <div className='bg-red-500/20 p-2.5 rounded-xl border border-red-500/20'>
                                <TriangleAlert className="w-5 h-5 text-red-400" />
                            </div>
                            <h2 className='text-xl font-semibold'>Critical Overspend Areas</h2>
                        </CardTitle>
                        <p className='text-xs text-muted-foreground mt-1 italic'>
                            Daily limit threshold: <span className="text-white font-mono">{overSpendsReports[0].threshold.toFixed(0)}{currency}</span>
                        </p>
                    </CardHeader>
                    <CardContent>
                        <div className={`grid grid-cols-1 gap-5 ${overSpendsReports.length > 2 ? 'xl:grid-cols-3 overflow-auto h-[300px] px-5' : ''}`}>
                            {overSpendsReports.map((report, index) => (
                                <CriticalCard
                                    key={index}
                                    {...report}
                                    currency={currency}
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
