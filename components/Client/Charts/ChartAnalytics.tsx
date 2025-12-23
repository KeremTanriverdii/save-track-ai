"use client"

import * as React from "react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
import {
    Card,
    CardContent,
} from "@/components/ui/card"

import { AnalyticsData, DailyChartData } from "@/lib/types/type"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
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


    return (
        <div>
            <Card className="bg-white/5 backdrop-blur-md border-white/10">
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