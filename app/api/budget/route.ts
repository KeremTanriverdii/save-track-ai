import { addbudget } from "@/lib/budged/Budget";
import { calcRemaining } from "@/lib/budged/calcRemaining";
import { getBudget } from "@/lib/budged/GetBudget";
import { getExpenses } from "@/lib/expenses/getExpense";
import { detectOverspendAreas } from "@/lib/insights/detectOverspendAreas";
import { Budget } from "@/lib/types/type";
import { getAuthenticatedUser } from "@/utils/getAuthenticatedUser";
import { dateCustom } from "@/utils/nowDate";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server"

export async function GET(req?: Request) {
    const verifyUid = await getAuthenticatedUser();

    if (!verifyUid) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req?.url as string);
    const totalSpendingStr = url.searchParams.get("totalSpending");
    const totalSpending = totalSpendingStr ? parseInt(totalSpendingStr, 10) : 0;

    const monthParam = url.searchParams.get("yearMonth");
    const targerData = monthParam || dateCustom()

    try {
        const data = await getBudget(verifyUid.uid, targerData) as Budget;
        const remaining = await calcRemaining(verifyUid.uid, totalSpending, targerData) as unknown as number;
        const dataExpense = await getExpenses(verifyUid.uid, targerData)
        const overSpends = detectOverspendAreas(dataExpense, data.budget)
        return NextResponse.json({ budget: data, remaining: remaining, overSpends: overSpends }, { status: 200 });
    } catch (error) {
        console.error("API error:", error);
        return new NextResponse(JSON.stringify({ message: "Error of database" }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

export async function POST(req: Request) {
    const verifyUid = await getAuthenticatedUser();
    if (!verifyUid) {
        return NextResponse.json({ error: 'Unauthorized: Please log in.' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { newBudget, yearMonth } = body;

        if (!newBudget || !yearMonth) {
            return NextResponse.json({ error: 'Budget and yearMonth fields are required.' }, { status: 400 });
        }

        await addbudget(newBudget, verifyUid.uid, yearMonth);

        revalidateTag(`budget-${yearMonth}`, { expire: 0 })
        return NextResponse.json({ message: 'Budget is added successfully.' }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 });
    }
}