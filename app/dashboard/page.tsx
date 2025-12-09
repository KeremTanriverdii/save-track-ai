import { calTotal } from "@/lib/analytics/calcTotal";
import { calcRemaining } from "@/lib/budged/calcRemaining";
import { getExpenses } from "@/lib/expenses/getExpense";
import { dateCustom } from "@/utils/nowDate";
import { Budget } from "@/lib/types/type";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircleIcon, Banknote, TrendingDown, Wallet } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import Image from "next/image";

export default async function Dashboard() {
    const expenseData: any = await getExpenses(dateCustom())
    const totalAmount = calTotal(expenseData)
    const remaining: Budget = await calcRemaining(totalAmount)
    return (
        <div className="relative me-3">
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
                    <CardContent>
                        <Wallet size={28} color="#47d016" className="mb-4 mx-auto" />
                        <div>
                            <p className=" text-gray-400 text-sm">
                                Total amount
                            </p>

                            <p className="text-4xl font-bold text-white">{totalAmount}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="styleCard">
                    <CardContent>
                        <Banknote size={28} color="#47d016" className="mb-4 mx-auto" />
                        <div>
                            <p className="text-gray-400 text-sm">
                                Budget
                            </p>

                            <p className="text-4xl font-bold text-white">
                                {remaining.budget}
                            </p>
                        </div>

                    </CardContent>
                </Card>

                <Card className="styleCard">
                    <CardContent>
                        <TrendingDown size={28} color="#cc1414" className="mb-4 mx-auto" />
                        <div>
                            <p className="text-gray-400 text-sm">
                                Remaining
                            </p>

                            <p className="text-4xl font-bold text-white">
                                {remaining.diff}
                            </p>
                        </div>
                    </CardContent>
                </Card>


                {remaining.diff < (remaining.budget * 0.2) && <Alert variant="destructive">
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
        </div>
    );
}


