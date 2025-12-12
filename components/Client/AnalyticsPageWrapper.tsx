"use client"
import { AnalyticsData, Expense } from '@/lib/types/type'
import React, { useReducer } from 'react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select'
import { transformToDailyChart } from '@/app/dashboard/analytics/action'
import { calTotal } from '@/lib/analytics/calcTotal'
import { calcTopCategorySpending } from '@/lib/analytics/calcTopCategory'
import { calcAverage } from '@/lib/analytics/calcAverage'
import { ChartAnalytics } from './Charts/ChartAnalytics'
import InsightPanelComponent from '../InsightPanelComponent'
import BudgetState from './Budget/BudgetStateComponent'
import Image from 'next/image'

interface AnalyticsState {
    chartsAnalitycsData: AnalyticsData;
    rawData: Expense[];
    isLoading: boolean;
    error: string | null;
    selectedMonth: string;
}

type AnalyticsAction =
    | { type: 'FETCH_START'; payload: { newMonth: string } }
    | { type: 'FETCH_SUCCESS'; payload: { data: AnalyticsData; rawData: Expense[] } }
    | { type: 'FETCH_EMPTY' }
    | { type: 'FETCH_ERROR'; payload: { error: string } };

function analyticsReducer(state: AnalyticsState, action: AnalyticsAction): AnalyticsState {
    switch (action.type) {
        case 'FETCH_START':
            // Loading start, 
            return {
                ...state,
                isLoading: true,
                error: null,
                selectedMonth: action.payload.newMonth,
            };
        case 'FETCH_SUCCESS':
            // Fetch is success, update the state
            return {
                ...state,
                isLoading: false,
                error: null,
                chartsAnalitycsData: action.payload.data,
                rawData: action.payload.rawData,
            };
        case 'FETCH_EMPTY':
            // Data is empty state going to zero
            return {
                ...state,
                isLoading: false,
                error: null,
                chartsAnalitycsData: {
                    dailyData: [],
                    totalSpending: 0,
                    averageSpending: 0,
                    mostSpendingCategory: null,
                },
                rawData: [],
            };
        case 'FETCH_ERROR':
            // when error state error
            return {
                ...state,
                isLoading: false,
                error: action.payload.error,
            };
        default:
            return state;
    }
}

// --- Component and First State  ---

export default function AnalyticsClientWrapperComponent({ initialData, currentMonth }: {
    initialData: AnalyticsData,
    currentMonth: string
}
) {
    const currentYear = new Date().getFullYear();

    const initialReducerState: AnalyticsState = {
        chartsAnalitycsData: initialData,
        rawData: initialData.rawData || [],
        isLoading: false,
        error: null,
        selectedMonth: currentMonth,
    };

    const [state, dispatch] = useReducer(analyticsReducer, initialReducerState);

    const { chartsAnalitycsData, rawData, isLoading, error, selectedMonth } = state;

    const handleMonthChange = async (newMonth: string) => {
        // Start the fetch
        dispatch({ type: 'FETCH_START', payload: { newMonth } });

        try {
            const res = await fetch(`/api/expenses?yearMonth=${newMonth}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                cache: 'no-store',
            })

            if (!res.ok) {
                throw new Error('Failed to fetch expenses');
            }

            const fetchedRawData: Expense[] = await res.json();

            // No avaible data 
            if (!fetchedRawData || fetchedRawData.length === 0) {
                dispatch({ type: 'FETCH_EMPTY' });
                return;
            }

            const dailyData = await transformToDailyChart(fetchedRawData);
            const totalSpending = calTotal(dailyData);
            const topCategory = calcTopCategorySpending(fetchedRawData);
            const averageSpending = calcAverage(dailyData);

            const newData = {
                dailyData,
                totalSpending,
                averageSpending,
                mostSpendingCategory: topCategory,
            };

            // Success 
            dispatch({ type: 'FETCH_SUCCESS', payload: { data: newData, rawData: fetchedRawData } });

        } catch (err) {
            console.error('Error fetching data:', err);
            // Error
            dispatch({ type: 'FETCH_ERROR', payload: { error: 'Failed to load data. Please try again.' } });
        }
    };

    const hasData = rawData && rawData.length > 0;

    return (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 md:p-5'>
            {/* ... Select Component ... */}
            <Select value={selectedMonth} onValueChange={handleMonthChange} disabled={isLoading}>
                {isLoading ? (
                    <div className="h-10 w-[180px] rounded-md bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg animate-pulse"></div>
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
                                    {new Date(`${currentYear}-${month}-01`).toLocaleDateString("en-US", { month: "long" })}
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
                    <div className="h-64 w-full rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg animate-pulse p-4 flex items-center justify-center text-white/70">
                        Analiz Verileri Yükleniyor...
                    </div>
                ) : !hasData ? (
                    <div className="p-8 text-center rounded-lg bg-muted/50">
                        <p className="text-lg font-medium text-muted-foreground">No data available</p>
                        <p className="text-sm text-muted-foreground mt-2">
                            No expenses found for {new Date(selectedMonth + '-01').toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                        </p>
                    </div>
                ) : (
                    <ChartAnalytics initialData={chartsAnalitycsData} />
                )}
            </div>

            <div className='col-span-2'>
                {isLoading ? (
                    <div className="h-40 w-full rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg animate-pulse">
                        <p className="text-center pt-16 text-white/70">Insight's Loading...</p>
                    </div>
                ) : !hasData ? (
                    <div className="p-6 text-center rounded-lg bg-muted/50">
                        <p className="text-muted-foreground">Start adding expenses to see insights</p>
                        <div>
                            <Image width={600} height={1600} alt='not-found-image' src='/not-found.png' className='aspect-video mx-auto mt-2' />
                        </div>
                    </div>
                ) : (
                    <InsightPanelComponent initialData={rawData} chartsData={chartsAnalitycsData} />
                )}
            </div>
        </div>
    )
}