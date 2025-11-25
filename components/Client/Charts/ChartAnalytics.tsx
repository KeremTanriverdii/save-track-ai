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
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { Select, SelectContent, SelectGroup, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SelectItem } from "@radix-ui/react-select"
import { calcAverage } from "@/lib/analytics/calcAverage"

export const description = "An interactive line chart"


export async function transformToDailyChart(data: any[]): Promise<any[]> {
    const transformData = data.reduce((acc: any[], curr: any) => {
        const day = new Date(curr.createdAt?.seconds * 1000).toISOString().substring(0, 10);
        const amount = curr.amount;
        const existingDay = acc.find((item) => item.day === day);
        if (existingDay) {
            existingDay.amount += amount;
        } else {
            acc.push({ day, amount });
        }
        return acc;
    }, []);
    return transformData
}

export function ChartAnalytics({ data }: { data: any[] }) {
    const [activeChart, setActiveChart] =
        React.useState<keyof typeof chartConfig>("amount")

    const year = new Date().getFullYear()
    const stateYear = new Date().toISOString().substring(0, 7)
    const [monthStates, setMonthStates] = React.useState(stateYear);
    const [isLoading, setIsLoading] = React.useState(false);

    const [chartData, setChartData] = React.useState<any[]>([]);
    const chartConfig = {
        views: {
            label: "Amount",
        },
        amount: {
            label: "amount",
            color: "var(--chart-1)",
        },

    } satisfies ChartConfig

    const total = calcAverage(chartData)
    /*  React.useMemo(() => {
        // 1. Calculate total spending
        const totalAmount = chartData.reduce((acc: number, curr: any) => acc + curr.amount, 0);

        // 2. Calculate average daily spending
        const currentDayOfMonth = new Date().getDate();
        const averageDaily = totalAmount / currentDayOfMonth;

        // This amount return the average value
        return {
            amount: parseFloat(averageDaily.toFixed(2)),
        };
    },
        [chartData],
    )
*/
    React.useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`/api/expenses?yearMonth=${monthStates}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                if (!response.ok) {
                    throw new Error(`HTTP errors: status: ${response.status}`)
                }
                const data = await response.json();
                const transformedData = await transformToDailyChart(data);
                setChartData(transformedData);
            } catch (err) {
                console.log(err)
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [monthStates])

    return (
        <Card className="py-4 sm:py-0">
            <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
                <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
                    <CardTitle>Line Chart - Interactive</CardTitle>
                    <CardDescription>
                        Showing total visitors for the last 3 months
                    </CardDescription>
                </div>
                <div className="flex">
                    <div>
                        <Select value={monthStates} onValueChange={setMonthStates} disabled={isLoading}> {/* value ve onValueChange ile state'i bağlayın */}
                            <SelectTrigger className="w-[180px]">
                                {/* Seçilen değer, SelectValue içinde otomatik olarak gösterilecektir */}
                                <SelectValue placeholder="Bir meyve seçin" className="text-white" >
                                    {monthStates.slice(0, 10).toLocaleUpperCase()}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Months</SelectLabel>
                                    <SelectItem value={year + "-01"} >February</SelectItem>
                                    <SelectItem value={year + "-02"}>January</SelectItem>
                                    <SelectItem value={year + "-03"}>March</SelectItem>
                                    <SelectItem value={year + "-04"}>April</SelectItem>
                                    <SelectItem value={year + "-05"}>May</SelectItem>
                                    <SelectItem value={year + "-06"}>June</SelectItem>
                                    <SelectItem value={year + "-07"}>July</SelectItem>
                                    <SelectItem value={year + "-08"}>August</SelectItem>
                                    <SelectItem value={year + "-09"}>September</SelectItem>
                                    <SelectItem value={year + "-11"}>October</SelectItem>
                                    <SelectItem value={year + "-11"}>November</SelectItem>
                                    <SelectItem value={year + "-12"}>December</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    {["amount"].map((key) => {
                        const chart = key as keyof typeof chartConfig
                        return (
                            <button
                                key={chart}
                                data-active={activeChart === chart}
                                className="data-[active=true]:bg-muted/50 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                                onClick={() => setActiveChart(chart)}
                            >
                                <span className="text-muted-foreground text-xs">
                                    {chartConfig[chart].label}
                                </span>
                                <span className="text-lg leading-none font-bold sm:text-3xl">
                                    {/* {total[key as keyof typeof total]} */}
                                    {total}
                                </span>
                            </button>
                        )
                    })}
                </div>
            </CardHeader>
            <CardContent className="px-2 sm:p-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"
                >
                    <LineChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="day"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={15}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value)
                                return date.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                })
                            }}
                        />
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    className="w-[150px]"
                                    nameKey="views"
                                    labelFormatter={(value) => {
                                        return 'Day ' + new Date(value).toLocaleDateString("en-US", {
                                            // month: "short",
                                            day: "numeric",
                                            // year: "numeric",
                                        })
                                    }}
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
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
