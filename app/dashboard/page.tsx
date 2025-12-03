import { calTotal } from "@/lib/analytics/calcTotal";
import { calcRemaining } from "@/lib/budged/calcRemaining";
import { getExpenses } from "@/lib/expenses/getExpense";
import { dateCustom } from "@/utils/nowDate";
import { Budget } from "@/lib/types/type";

export default async function Dashboard() {
    const expenseData: any = await getExpenses(dateCustom())
    const totalAmount = calTotal(expenseData)
    // console.log(totalAmount)
    const remaining: Budget = await calcRemaining(totalAmount)
    return (
        <div className="w-[500px]">
            <div>Total amount: {totalAmount}</div>
            <div>Budget: {remaining.budget}</div>
            <div>Remaining Diff: {remaining.diff}</div>
            {remaining.diff < (remaining.budget * 0.2) && <div>You're almost there!</div>}
        </div>
    );
}