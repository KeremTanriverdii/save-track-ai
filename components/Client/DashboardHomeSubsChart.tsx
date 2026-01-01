"use client"

import { LabelList, Pie, PieChart } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    type ChartConfig,
} from "@/components/ui/chart"
import { ChartSubsDetails } from "@/lib/types/type"
interface Props {
    totalSubs: number | undefined
    subDetails: ChartSubsDetails[] | undefined
}
export function DashboardHomeSubsChart({ totalSubs, subDetails }: Props) {
    const dynamicChartData = subDetails?.map((item, index) => {
        const frequencyLabel = item.frequency === 'yearly' ? ' Year' : ' Month';
        return {
            id: item.id,
            title: item.title,
            totalSpent: item.totalPaidForThis,
            totalPeriod: `${item.totalPeriodsProcessed}${frequencyLabel}${item.totalPeriodsProcessed > 1 ? 's' : ''}`,
            status: item.status,
            currency: item.currency,
            fill: `var(--chart-${(index % 5) + 1})`,
        }
    })


    const dynamicChartConfig = subDetails?.reduce((acc, item, index) => {
        acc[item.title] = {
            label: item.title,
            color: `var(--chart-${(index % 5) + 1})`,
        };
        return acc;
    }, {
        totalSpent: { label: "Total Spent" }
    } as ChartConfig) || {};

    return (
        <Card className="flex flex-row p-5">
            <CardHeader className="items-center">
                <CardTitle className="text-nowrap">Your Subscription Summary <br />
                    <CardDescription>Your all of time total subscription spend</CardDescription>
                </CardTitle>
                <div>
                    <span className="text-2xl font-bold">
                        {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: subDetails?.[0]?.currency === '$' ? 'USD' : subDetails?.[0]?.currency === '€' ? 'EUR' : subDetails?.[0]?.currency === '₺' ? 'TRY' : 'USD',
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        }).format(totalSubs || 0)}
                    </span>
                    <p className="text-muted-foreground">Total Subscription Spend</p>
                </div>
            </CardHeader>
            <CardContent className="flex-1 p-0">
                <ChartContainer
                    config={dynamicChartConfig}
                    className="[&_.recharts-text]:fill-background ms-auto  max-h-[250px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    const data = payload[0].payload;
                                    return (
                                        <div className="flex flex-col gap-2 rounded-lg border border-white/10 bg-black/80 p-3 shadow-xl backdrop-blur-md">
                                            <div className="flex items-center gap-2 border-b border-white/5 pb-1">
                                                <div
                                                    className="h-2 w-2 rounded-full"
                                                    style={{ backgroundColor: data.fill }}
                                                />
                                                <span className="font-bold text-white text-sm">{data.title}</span>
                                            </div>

                                            <div className="flex flex-col gap-1 text-[12px]">
                                                <div className="flex justify-between gap-4">
                                                    <span className="text-muted-foreground">Spend:</span>
                                                    <span className="text-white font-mono">{data.totalSpent} {data.currency}</span>
                                                </div>
                                                <div className="flex justify-between gap-4">
                                                    <span className="text-muted-foreground">Time:</span>
                                                    <span className="text-blue-300">{data.totalPeriod}</span>
                                                </div>
                                                <div className="flex justify-between gap-4">
                                                    <span className="text-muted-foreground">Status:</span>
                                                    <span className={data.status === 'active' ? 'text-emerald-500' : 'text-rose-500'}>
                                                        {data.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Pie data={dynamicChartData} dataKey="totalSpent" >
                            <LabelList
                                dataKey="title"
                                className="fill-background"
                                stroke="none"
                                fontSize={12}
                                formatter={(value: keyof typeof dynamicChartConfig) =>
                                    dynamicChartConfig[value]?.label ?? value
                                }
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>

        </Card>
    )
}
