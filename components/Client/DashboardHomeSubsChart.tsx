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
import { ChartSubsDetails } from "@/lib/expenses/getSubscriptionDetails"




interface Props {
    totalSubs: number | undefined
    subDetails: ChartSubsDetails[] | undefined
}


export function DashboardHomeSubsChart({ totalSubs, subDetails }: Props) {

    const dynamicChartData = subDetails?.map((item, index) => {
        const frequencyLabel = item.frequency === 'yearly' ? ' Year' : ' Month';
        return {
            subscription: item.id,
            totalSpent: item.totalPaidForThis,
            totalPeriod: `${item.totalPeriodsProcessed}${frequencyLabel}${item.totalPeriodsProcessed > 1 ? 's' : ''}`,
            status: item.status,
            currency: item.currency,
            fill: `var(--chart-${(index % 5) + 1})`,
        }
    })


    const dynamicChartConfig = subDetails?.reduce((acc, item, index) => {
        acc[item.id] = {
            label: item.id,
            color: `var(--chart-${(index % 5) + 1})`,
        };
        return acc;
    }, {
        totalSpent: { label: "Total Spent" }
    } as ChartConfig) || {};

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Your Total Subscriptions</CardTitle>
                <CardDescription>Your all of time total subscription spend: <span className="text-2xl">{totalSubs}{subDetails?.[0]?.currency}</span></CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={dynamicChartConfig}
                    className="[&_.recharts-text]:fill-background mx-auto aspect-square max-h-[250px]"
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
                                                <span className="font-bold text-white text-sm">{data.subscription}</span>
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
                                dataKey="subscription"
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
