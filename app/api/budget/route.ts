import { addbudget } from "@/lib/budged/Budget";
import { calcRemaining } from "@/lib/budged/calcRemaining";
import { getBudget } from "@/lib/budged/GetBudget";
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
    const nowDate = dateCustom();

    try {

        const data = await getBudget(verifyUid, nowDate) as number;
        const remaining = await calcRemaining(verifyUid, totalSpending, nowDate) as unknown as number;
        return NextResponse.json({ budget: data, remaining: remaining }, { status: 200 });
    } catch (error) {
        console.error("API error:", error);
        return new NextResponse(JSON.stringify({ message: "Error of database" }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

export async function POST(req: Request) {
    const uid = await getAuthenticatedUser();
    if (!uid) {
        return NextResponse.json({ error: 'Unauthorized: Please log in.' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { budget, yearMonth } = body;

        if (!budget || !yearMonth) {
            return NextResponse.json({ error: 'Budget and yearMonth fields are required.' }, { status: 400 });
        }

        await addbudget(budget, uid, yearMonth);

        revalidateTag('budget-data', { expire: 0 })
        return NextResponse.json({ message: 'Budget is added successfully.' }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 });
    }
}