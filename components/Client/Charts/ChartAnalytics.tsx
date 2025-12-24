"use client"

import * as React from "react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import {
    Card,
    CardContent,
} from "@/components/ui/card"

import { AnalyticsData, DailyChartData } from "@/lib/types/type"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { TrendingUpIcon } from "lucide-react"
export const description = "An interactive line chart"

export function ChartAnalytics({ initialData }: { initialData: AnalyticsData }) {
    const chartData: DailyChartData[] = initialData.dailyData || []
    const mostSpendingCategory = (initialData.mostSpendingCategory)
    const totalSpending = initialData.totalSpending
    const chartConfig = {
        amount: {
            label: "Amount",
            color: "hsl(var(--chart-1))",
        },
    } satisfies ChartConfig
    console.log(mostSpendingCategory)

    return (
        <div>
            <Card className="bg-white/5 backdrop-blur-md border-white/10 mt-0 pt-0 pr-0 mr-0">
                <CardContent className="flex justify-between gap-3 p-0">
                    <div className="p-5">
                        <h2 className="text-4xl font-bold text-white">Analytics Overview</h2>
                        <p className="text-muted-foreground">Daily spending breakdown vs projection</p>
                    </div>
                    <div className="flex text-2xl gap-5 items-start">
                        <div>
                            <span className="text-muted-foreground text-sm mt-2 py-1">Top Category</span>
                            <span className="text-sm flex gap-2 items-center">
                                <TrendingUpIcon size={20} color="red" />
                                {mostSpendingCategory ? Object.keys(mostSpendingCategory)[0] : "N/A"}</span>
                        </div>
                        {mostSpendingCategory && (
                            <div className="flex flex-col text-2xl px-5 py-1 bg-[#212227] border-t-0 rounded-2xl rounded-t-none">
                                <span className="text-start font-light mt-2">TOTAL SPENT</span>
                                <span className="text-center">{totalSpending.toFixed(2)}</span>
                            </div>
                        )}
                    </div>

                </CardContent>
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-[250px] w-full">
                        <LineChart data={chartData} margin={{ left: 12, right: 12 }}>
                            <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.1)" />

                            <XAxis
                                dataKey="day"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={10}
                                tickFormatter={(value) => value}
                            />

                            <YAxis
                                dataKey="amount"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={10}
                                tickFormatter={(value) => value.toLocaleString() + 'K'}
                            />

                            <ChartTooltip
                                content={
                                    <ChartTooltipContent
                                        labelFormatter={(value) => `Day ${value}`}
                                        className="bg-black/80 backdrop-blur-xl border-white/20"
                                    />
                                }
                            />

                            <Line
                                dataKey="amount"
                                type="monotone"
                                stroke="var(--chart-1)"
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ChartContainer>
                </CardContent>
            </Card>

        </div>

    )
}