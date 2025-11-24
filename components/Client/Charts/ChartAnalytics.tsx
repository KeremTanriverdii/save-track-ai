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

export const description = "An interactive line chart"


const chartData = [
    { date: "2024-04-01", amount: 222 },
    { date: "2024-04-02", amount: 97 },
    { date: "2024-04-03", amount: 167 },
    { date: "2024-04-04", amount: 242 },
    { date: "2024-04-05", amount: 373 },
    { date: "2024-04-06", amount: 301 },
    { date: "2024-04-07", amount: 245 },
    { date: "2024-04-08", amount: 409 },
    { date: "2024-04-09", amount: 59 },
    { date: "2024-04-10", amount: 261 },
    { date: "2024-04-11", amount: 327 },
    { date: "2024-04-12", amount: 292 },
    { date: "2024-04-13", amount: 342 },
    { date: "2024-04-14", amount: 137 },
    { date: "2024-04-15", amount: 120 },
    { date: "2024-04-16", amount: 138 },
    { date: "2024-04-17", amount: 446 },
    { date: "2024-04-18", amount: 364 },
    { date: "2024-04-19", amount: 243 },
    { date: "2024-04-20", amount: 89 },
    { date: "2024-04-21", amount: 137 },
    { date: "2024-04-22", amount: 224 },
    { date: "2024-04-23", amount: 138 },
    { date: "2024-04-24", amount: 387 },
    { date: "2024-04-25", amount: 215 },
    { date: "2024-04-26", amount: 75 },
    { date: "2024-04-27", amount: 383 },
    { date: "2024-04-28", amount: 122 },
    { date: "2024-04-29", amount: 315 },
    { date: "2024-04-30", amount: 454 },
    { date: "2024-05-01", amount: 165 },
    { date: "2024-05-02", amount: 293 },
    { date: "2024-05-03", amount: 247 },
    { date: "2024-05-04", amount: 385 },
    { date: "2024-05-05", amount: 481 },
    { date: "2024-05-06", amount: 498 },
    { date: "2024-05-07", amount: 388 },
    { date: "2024-05-08", amount: 149 },
    { date: "2024-05-09", amount: 227 },
    { date: "2024-05-10", amount: 293 },
    { date: "2024-05-11", amount: 335 },
    { date: "2024-05-12", amount: 197 },
    { date: "2024-05-13", amount: 197 },
    { date: "2024-05-14", amount: 448 },
    { date: "2024-05-15", amount: 473 },
    { date: "2024-05-16", amount: 338 },
    { date: "2024-05-17", amount: 499 },
    { date: "2024-05-18", amount: 315 },
    { date: "2024-05-19", amount: 235 },
    { date: "2024-05-20", amount: 177 },
    { date: "2024-05-21", amount: 82 },
    { date: "2024-05-22", amount: 81 },
    { date: "2024-05-23", amount: 252 },
    { date: "2024-05-24", amount: 294 },
    { date: "2024-05-25", amount: 201 },
    { date: "2024-05-26", amount: 213 },
    { date: "2024-05-27", amount: 420 },
    { date: "2024-05-28", amount: 233 },
    { date: "2024-05-29", amount: 78 },
    { date: "2024-05-30", amount: 340 },
    { date: "2024-05-31", amount: 178 },
    { date: "2024-06-01", amount: 178 },
    { date: "2024-06-02", amount: 470 },
    { date: "2024-06-03", amount: 103 },
    { date: "2024-06-04", amount: 439 },
    { date: "2024-06-05", amount: 88 },
    { date: "2024-06-06", amount: 294 },
    { date: "2024-06-07", amount: 323 },
    { date: "2024-06-08", amount: 385 },
    { date: "2024-06-09", amount: 438 },
    { date: "2024-06-10", amount: 155 },
    { date: "2024-06-11", amount: 92 },
    { date: "2024-06-12", amount: 492 },
    { date: "2024-06-13", amount: 81 },
    { date: "2024-06-14", amount: 426 },
    { date: "2024-06-15", amount: 307 },
    { date: "2024-06-16", amount: 371 },
    { date: "2024-06-17", amount: 475 },
    { date: "2024-06-18", amount: 107 },
    { date: "2024-06-19", amount: 341 },
    { date: "2024-06-20", amount: 408 },
    { date: "2024-06-21", amount: 169 },
    { date: "2024-06-22", amount: 317 },
    { date: "2024-06-23", amount: 480 },
    { date: "2024-06-24", amount: 132 },
    { date: "2024-06-25", amount: 141 },
    { date: "2024-06-26", amount: 434 },
    { date: "2024-06-27", amount: 448 },
    { date: "2024-06-28", amount: 149 },
    { date: "2024-06-29", amount: 103 },
    { date: "2024-06-30", amount: 446 },
]

const chartConfig = {
    views: {
        label: "Amount",
    },
    amount: {
        label: "amount",
        color: "var(--chart-1)",
    },

} satisfies ChartConfig

export function ChartAnalytics({ data }: { data: any[] }) {
    const [activeChart, setActiveChart] =
        React.useState<keyof typeof chartConfig>("amount")

    const year = new Date().getFullYear()
    const stateYear = new Date().toISOString().substring(0, 7)
    const [monthStates, setMonthStates] = React.useState(stateYear);
    const [isLoading, setIsLoading] = React.useState(false);
    const [chartData2, setChartData2] = React.useState<any[]>([]);


    const total = React.useMemo(
        () => ({
            amount: chartData.reduce((acc, curr) => acc + curr.amount, 0),
            //  chartData.reduce((acc, curr) => acc + curr.mobile, 0),
        }),
        []
    )

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
                setChartData2(data)
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
                                    {total[key as keyof typeof total]}
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
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
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
                                        return new Date(value).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
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
