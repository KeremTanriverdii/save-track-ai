"use client"
import { AnalyticsData, DailyChartData, Expense } from '@/lib/types/type'
import React from 'react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select'
import { getMonthlyAnalytics } from '@/app/dashboard/analytics/action'
import { ChartAnalytics } from './Charts/ChartAnalytics'
import InsightPanelComponent from '../InsightPanelComponent'

export default function AnalyticsClientWrapperComponent({ initialData, currentMonth }: {
    initialData: AnalyticsData,
    currentMonth: string
}
) {
    const [isPending, startTransition] = React.useTransition();
    const currentYear = new Date().getFullYear()
    const [selectedMonth, setSelectedMonth] = React.useState(currentMonth)
    const [chartsAnalitycsData, setChartDataAnalytics] = React.useState<AnalyticsData>(initialData)
    const [rawData, setRawData] = React.useState<Expense[]>(initialData.rawData || [])
    const [dailyData, setDailyData] = React.useState<DailyChartData[]>(initialData.dailyData || [])



    const handleMonthChange = (newMonth: string) => {
        setSelectedMonth(newMonth);
        startTransition(async () => {
            try {
                const newData = await getMonthlyAnalytics(newMonth);

                setChartDataAnalytics(newData)
                setRawData(newData.rawData || [])
                setDailyData(newData.dailyData)
            } catch (err) {
                console.error("Error with server action:", err);
            }
        });
    };
    return (
        <div className='grid grid-cols-1 md:grid-cols-4'>
            <Select value={selectedMonth} onValueChange={handleMonthChange} disabled={isPending}>
                {isPending ? (
                    <div className="h-10 w-[180px] rounded-md bg-muted animate pulse"></div>
                ) :
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                }
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Months</SelectLabel>
                        {[...Array(12)].map((_, i) => {
                            const month = (i + 1).toString().padStart(2, "0")
                            const dateValue = `${currentYear}-${month}`
                            return (
                                <SelectItem key={month} value={dateValue}>
                                    {new Date(`${currentYear}-${month}-01`).toLocaleDateString("en-US", {
                                        month: "long",
                                    })}
                                </SelectItem>
                            )
                        })}
                    </SelectGroup>
                </SelectContent>
            </Select>

            <div className='col-span-4'>
                <ChartAnalytics initialData={chartsAnalitycsData} />
            </div>

            <div>
                {isPending ? (
                    <div className="h-40 w-full rounded-lg bg-muted animate-pulse"> {/* Örnek Skeleton */}
                        Loading datas...
                    </div>
                ) : (
                    <InsightPanelComponent initialData={rawData} dailyData={dailyData} />
                )}
            </div>
        </div>
    )
}
