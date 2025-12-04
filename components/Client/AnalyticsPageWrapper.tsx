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
import { getBudget } from '@/lib/budged/GetBudget'
import Image from 'next/image'
import BudgetState from './Budget/BudgetStateComponent'

export default function AnalyticsClientWrapperComponent({ initialData, currentMonth }: {
    initialData: AnalyticsData,
    currentMonth: string
}
) {
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const [error, setError] = React.useState<string | null>(null)
    const currentYear = new Date().getFullYear()
    const [selectedMonth, setSelectedMonth] = React.useState(currentMonth)
    const [chartsAnalitycsData, setChartDataAnalytics] = React.useState<AnalyticsData>(initialData)
    const [rawData, setRawData] = React.useState<Expense[]>(initialData.rawData || [])

    const handleMonthChange = async (newMonth: string) => {
        setSelectedMonth(newMonth);
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch(`/api/expenses?yearMonth=${newMonth}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                cache: 'no-store',
            })

            if (!res.ok) {
                throw new Error('Failed to fetch expenses');
            }

            const rawData: Expense[] = await res.json();

            // Check if data is empty
            if (!rawData || rawData.length === 0) {
                setChartDataAnalytics({
                    dailyData: [],
                    totalSpending: 0,
                    averageSpending: 0,
                    mostSpendingCategory: null,
                    // budget: await getBudget(newMonth) // Removed as budget is not part of AnalyticsData state
                });
                setRawData([]);
                return;
            }

            const dailyData = await transformToDailyChart(rawData);
            const totalSpending = calTotal(dailyData);
            const topCategory = calcTopCategorySpending(rawData);
            const averageSpending = calcAverage(dailyData);

            const newData = {
                dailyData,
                totalSpending,
                averageSpending,
                mostSpendingCategory: topCategory,
                // budget // Removed as budget is not part of AnalyticsData state
            };

            setChartDataAnalytics(newData);
            setRawData(rawData);

        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Failed to load data. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const hasData = rawData && rawData.length > 0;

    return (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 md:p-5'>
            {/* Select component from: ../ui/select */}
            <Select value={selectedMonth} onValueChange={handleMonthChange} disabled={isLoading}>
                {isLoading ? (
                    <div className="h-10 w-[180px] rounded-md bg-muted animate-pulse"></div>
                ) : (
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                )}
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

            <div className='col-span-1 col-start-2'>
                <BudgetState total={chartsAnalitycsData.totalSpending} />
            </div>

            <div className='col-span-2'>
                {error ? (
                    <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
                        {error}
                    </div>
                ) : isLoading ? (
                    <div className="h-64 w-full rounded-lg bg-muted animate-pulse"></div>
                ) : !hasData ? (
                    <div className="p-8 text-center rounded-lg bg-muted/50">
                        <p className="text-lg font-medium text-muted-foreground">No data available</p>
                        <p className="text-sm text-muted-foreground mt-2">
                            No expenses found for {new Date(selectedMonth + '-01').toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                        </p>
                    </div>
                ) : (
                    // ChartAnalytics from: ./Charts/ChartAnalytics
                    <ChartAnalytics initialData={chartsAnalitycsData} />
                )}
            </div>

            <div className='col-span-2'>
                {isLoading ? (
                    <div className="h-40 w-full rounded-lg bg-muted animate-pulse">
                        <p className="text-center pt-16 text-muted-foreground">Loading data...</p>
                    </div>
                ) : !hasData ? (
                    <div className="p-6 text-center rounded-lg bg-muted/50">
                        <p className="text-muted-foreground">Start adding expenses to see insights</p>
                        <div>
                            <Image width={600} height={1600} alt='not-found-image' src='/not-found.png' className='aspect-video mx-auto mt-2' />
                        </div>
                    </div>
                ) : (
                    // InsightPanelComponent from: ../InsightPanelComponent
                    <InsightPanelComponent initialData={rawData} chartsData={chartsAnalitycsData} />
                )}
            </div>
        </div>
    )
}