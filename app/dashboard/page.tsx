import { calcRemaining } from "@/lib/budged/calcRemaining";
import { dateCustom } from "@/utils/nowDate";
import { RemainingResponse } from "@/lib/types/type";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircleIcon, Banknote, CalendarClock, TrendingDown, Wallet } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import Image from "next/image";
import { getUserData } from "@/lib/auth/user";
import { DashboardHomeSubsChart } from "@/components/Client/DashboardHomeSubsChart";
import { getSubscriptionDetails } from "@/lib/expenses/getSubscriptionDetails";
import ProgressRemaining from "@/components/Client/ProgressRemaining";
import FetchAllAndMonthlyBudget from "@/lib/expenses/totalAmount";

export function formatterCurrency(amount: number, curr: string) {
    const formatter = new Intl.NumberFormat('en-Us', {
        style: 'currency',
        currency: curr === '$' ? 'USD' : curr === '€' ? 'EUR' : curr === '₺' ? 'TRY' : 'USD',
        trailingZeroDisplay: 'stripIfInteger'
    })
    return formatter.format(amount)
}

export default async function Dashboard() {
    const user = await getUserData();
    if (!user) {
        throw new Error('User not found')
    }


    const totalAmount = await FetchAllAndMonthlyBudget(user.uid) || {
        allTime: { total: 0, subsData: [] },
        currentMonth: { budget: 0, totalMonth: 0, monthlySpend: 0, remaining: 0 }
    };

    const subsDetails = await getSubscriptionDetails(user.uid) || [];
    const allBudget: RemainingResponse | undefined = await calcRemaining(user.uid, totalAmount?.allTime.total || 0, dateCustom())
    if (!allBudget) throw new Error('Remaining not found')


    const { subsData, total } = totalAmount.allTime;
    const { budget, totalMonth, monthlySpend, remaining } = totalAmount.currentMonth;
    const { rDiff, rCurrency } = allBudget

    const nowMonthAndYear = new Date().toLocaleDateString('en-Us', {
        month: 'long',
        year: 'numeric'
    })


    return (
        <div className="relative me-3 space-y-7">
            <section className="bg-gradient-to-r from-[#4A00E0] to-[#8E2DE2] rounded-lg p-5 mt-3 flex items-center justify-between mb-8" data-purpose="welcome-banner">

                <div className="text-white" data-purpose="banner-text">
                    <h2 className="text-4xl font-bold mb-2">Stay on Track!</h2>
                    <p className="text-lg text-indigo-200">Review your spending and achieve your financial goals.</p>
                </div>

                <div data-purpose="banner-illustration">
                    <Image width={300} height={200} className="w-56 h-auto bg-transparent" src="/banner-logo.png" alt="Piggy bank illustration" />
                </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <Card title="Total Amount" className="styleCard">
                    <CardContent className="p-8">
                        <div className="p-3 mx-auto bg-green-500/30 rounded-full w-fit ">
                            <Wallet size={28} color="#47d016" className="mx-auto" />
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm my-3">
                                Total amount all of time
                            </p>

                            <p className="text-4xl font-bold text-white">{`${formatterCurrency(total, rCurrency)}`}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card title="Total Amount" className="styleCard">
                    <CardContent className="p-8">
                        <div className="p-3 mx-auto w-fit bg-blue-400/30 rounded-full">
                            <CalendarClock size={28} color="aqua" className="mx-auto" />
                        </div>
                        <div>
                            <p className=" text-gray-400 text-sm my-3">
                                Total amount of this month
                            </p>
                            <p className="text-4xl font-bold text-white">{`${formatterCurrency(totalMonth, rCurrency)}`}</p>
                            <span className="text-muted-foreground mt-3">{nowMonthAndYear}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="styleCard">
                    <CardContent className="p-8">
                        <div className="p-3 mx-auto w-fit bg-violet-400/30 rounded-full">
                            <Banknote size={28} color="#47d016" className="mx-auto" />
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm my-3">
                                Budget of this month
                            </p>

                            <p className="text-4xl font-bold text-white">
                                {formatterCurrency(budget, rCurrency)}
                            </p>
                        </div>

                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                <Card className="styleCard">
                    <CardContent className="p-8">
                        <TrendingDown size={28} color="#cc1414" className="mb-4 mx-auto" />
                        <div>
                            <p className="text-gray-400 text-sm">
                                Remaining for this month
                            </p>

                            <p className="text-4xl font-bold text-white my-3">
                                {formatterCurrency(remaining, rCurrency)}
                            </p>
                            <div className="space-y-2">
                                <ProgressRemaining budgetMonth={budget} totalMonth={totalMonth} />
                                <span>The remaining {Math.max(0, Math.round(((budget - monthlySpend) / budget) * 100))}%</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <DashboardHomeSubsChart totalSubs={subsData} subDetails={subsDetails} />
            </div>


            {remaining && rDiff !== undefined && rDiff < (rDiff * 0.2) && <Alert variant="destructive">
                <AlertCircleIcon />
                <AlertTitle>Your balance is low and nearly empty or in minus </AlertTitle>
                <AlertDescription>
                    <p>Your check the below points</p>
                    <ul className="list-inside list-disc text-sm">
                        <li>Check the expenses this month</li>
                        <li>Check the budgets this month</li>
                        <li>You analysis the expenses with ai-coach in the
                            <Link href={'/dashboard/analytics'} className="ms-1 text-blue-500">
                                analytics page
                            </Link>
                        </li>
                    </ul>
                </AlertDescription>
            </Alert>}

        </div>
    );
}
