"use client"
import { AnalyticsData, DailyChartData, Expense } from '@/lib/types/type'
import React from 'react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select'
import { transformToDailyChart } from '@/app/dashboard/analytics/action'
import { ChartAnalytics } from './Charts/ChartAnalytics'
import InsightPanelComponent from '../InsightPanelComponent'
import { calTotal } from '@/lib/analytics/calcTotal'
import { calcTopCategorySpending } from '@/lib/analytics/calcTopCategory'
import { calcAverage } from '@/lib/analytics/calcAverage'
import { getBudged } from '@/lib/budged/GetBudget'

export default function AnalyticsClientWrapperComponent({ initialData, currentMonth }: {
    initialData: AnalyticsData,
    currentMonth: string
}
) {
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const currentYear = new Date().getFullYear()
    const [selectedMonth, setSelectedMonth] = React.useState(currentMonth)
    const [chartsAnalitycsData, setChartDataAnalytics] = React.useState<AnalyticsData>(initialData)
    const [rawData, setRawData] = React.useState<Expense[]>(initialData.rawData || [])
    // const [dailyData, setDailyData] = React.useState<DailyChartData[]>(initialData.dailyData || [])

    const handleMonthChange = (newMonth: string) => {
        setSelectedMonth(newMonth);
        setIsLoading(true);

        const fetchRequest = async () => {
            const res = await fetch(`/api/expenses?yearMonth=${newMonth}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                cache: 'no-store',
            })
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            const rawData: Expense[] = await res.json();
            const dailyData = await transformToDailyChart(rawData);
            const totalSpending = calTotal(dailyData);
            const topCategory = calcTopCategorySpending(rawData);
            const averageSpending = calcAverage(dailyData);
            const budget = getBudged();
            return {
                initialData: {
                    rawData,
                    dailyData,
                    totalSpending,
                    averageSpending,
                    mostSpendingCategory: topCategory,
                    budget
                }
            }
        }
        fetchRequest().then((data) => {
            const initialData = data.initialData;
            const { rawData, ...restData } = initialData;

            setChartDataAnalytics(restData);
            setRawData(rawData);
        })
        setIsLoading(false);
    };
    return (
        <div className='grid grid-cols-1 md:grid-cols-4'>
            <Select value={selectedMonth} onValueChange={handleMonthChange} disabled={isLoading}>
                {isLoading ? (
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
                {isLoading ? (
                    <div className="h-40 w-full rounded-lg bg-muted animate-pulse"> {/* Örnek Skeleton */}
                        Loading datas...
                    </div>
                ) : (
                    <InsightPanelComponent initialData={rawData} chartsData={chartsAnalitycsData} />
                )}
            </div>
        </div>
    )
}
