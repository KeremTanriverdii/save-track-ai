"use client"

import * as React from "react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import BudgetState from "../Budget/BudgetStateComponent"
import { AnalyticsData, DailyChartData } from "@/lib/types/type"
// import { getMonthlyAnalytics } from "@/app/dashboard/analytics/action"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
// import { getMonthlyAnalytics, AnalyticsData, DailyChartData } from "@/lib/actions" // Yeni Action import'u

export const description = "An interactive line chart"


// Başlangıç verisini prop olarak alacak şekilde güncellendi
export function ChartAnalytics({ initialData }: { initialData: AnalyticsData }) {
    const [isPending] = React.useTransition();

    const chartData: DailyChartData[] = initialData.dailyData || []
    const mostSpendingCategory = (initialData.mostSpendingCategory)
    const totalSpending = initialData.totalSpending

    const [activeChart, setActiveChart] = React.useState<keyof typeof chartConfig>("amount")
    const chartConfig = {
        amount: {
            label: "Amount",
            color: "var(--chart-1)",
        },
    } satisfies ChartConfig

    return (
        <div>

            <Card className="py-4 sm:py-0 h-full col-span-4">
                <CardHeader className="flex flex-col items-stretch border-b sm:flex-row">
                    <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
                        <CardTitle>Analytics Overview</CardTitle>
                        <CardDescription>Daily spending breakdown</CardDescription>
                    </div>

                    <div className="flex items-center gap-5 ">

                        <div className="text-sm">
                            <p>Most Spending Category: {mostSpendingCategory ? Object.keys(mostSpendingCategory)[0] : 'Not found'}</p>
                            <p>Total Category Spend: {mostSpendingCategory ? Object.values(mostSpendingCategory)[0] : 'N/A'}</p>
                            {/* <span>average: {averageSpending.toFixed(2)}</span> */}
                        </div>

                        <button
                            data-active={activeChart === "amount"}
                            className="data-[active=true]:bg-muted/50 flex flex-col justify-center gap-1 border px-6 py-4 text-left"
                            onClick={() => setActiveChart("amount")}
                        >
                            <span className="text-muted-foreground text-xs">Amount</span>
                            <span className="text-lg font-bold sm:text-3xl">{totalSpending}</span>
                        </button>
                    </div>
                </CardHeader>

                <CardContent className="px-2 sm:p-6">
                    {(isPending && chartData.length === 0) ? (
                        // İlk yükleme veya veri yokken isPending true ise göster
                        <div className="h-[250px] w-full animate-pulse rounded-md bg-muted"></div>
                    ) : (<>
                        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
                            <>
                                {isPending && (
                                    // Veri güncellenirken grafiğin üzerine bir loading katmanı ekle
                                    <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
                                        <span className="text-xl font-semibold">Updating...</span>
                                    </div>
                                )}
                                <LineChart data={chartData} margin={{ left: 12, right: 12 }}>
                                    <CartesianGrid vertical={false} />

                                    <XAxis
                                        dataKey="day"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={15}
                                        minTickGap={32}
                                        tickFormatter={(value) =>
                                            new Date(value).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                            })
                                        }
                                    />

                                    <ChartTooltip
                                        content={
                                            <ChartTooltipContent
                                                className="w-[150px]"
                                                nameKey="views"
                                                labelFormatter={(value) =>
                                                    "Day " +
                                                    new Date(value).toLocaleDateString("en-US", {
                                                        day: "numeric",
                                                    })
                                                }
                                            />
                                        }
                                    />

                                    <Line
                                        dataKey={activeChart}
                                        type="monotone"
                                        stroke={`var(--color-${activeChart})`}
                                        strokeWidth={2}
                                        dot={false}
                                    />
                                </LineChart>
                            </>
                        </ChartContainer></>)
                    }
                </CardContent>
            </Card>

        </div>

    )
}