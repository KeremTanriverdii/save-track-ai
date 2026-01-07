import { NextResponse } from 'next/server';
import { getExpenses } from "@/lib/expenses/getExpense";
import { addExpense } from "@/lib/expenses/addExpense";
import { deleteExpense } from "@/lib/expenses/deleteExpense";
import { updateExpense } from "@/lib/expenses/uptadeExpense";
import { getAuthenticatedUser } from '@/utils/getAuthenticatedUser';
import { revalidateTag } from 'next/cache';
import { ExpensePayload } from '@/lib/types/type';


export async function POST(request: Request) {
    const verifyUid = await getAuthenticatedUser();

    if (!verifyUid) {
        return NextResponse.json({ error: 'Unauthorized' })
    }
    try {

        const body: ExpensePayload = await request.json();
        const { amount, category, expenseDate } = body;
        const finalDate = expenseDate || new Date().toISOString();
        const targetMonthTag = `expenses-${finalDate.substring(0, 7)}`;
        const budgetDate = `budget-${finalDate.substring(0, 7)}`

        if (!amount || !category) {
            return NextResponse.json(
                { error: "Missing required fields: amount and category are required." },
                { status: 400 }
            );
        }


        // Firestore Logic
        addExpense(body, verifyUid.uid as string)

        if (!targetMonthTag.includes('undefined')) {
            revalidateTag(targetMonthTag, { expire: 0 })
            revalidateTag(budgetDate, { expire: 0 })
        }
        return NextResponse.json(
            {
                message: "Expense added successfully.",
            },
            { status: 201 }
        );


    } catch (err) {
        console.error("Error: add expense during request", err);
        // Return error 
        return NextResponse.json(
            { error: "Server Error: add expense during request" },
            { status: 500 }
        );
    }
}

export async function GET(req: Request) {
    const verifyUid = await getAuthenticatedUser();
    if (!verifyUid) {
        return NextResponse.json({ error: 'Unauthorized' })
    }
    try {
        const { searchParams } = new URL(req.url)
        const month = searchParams.get('yearMonth')
        let usersCollectionData

        if (month) {
            usersCollectionData = await getExpenses(verifyUid.uid, month);
            return NextResponse.json(usersCollectionData, { status: 200 })
        } else {
            usersCollectionData = await getExpenses(verifyUid.uid, undefined);
            return NextResponse.json(usersCollectionData, { status: 200 })
        }

    } catch (err) {
        console.log(err)
        return NextResponse.json(
            { message: 'error get request', error: err },
            { status: 500 }
        )

    }
}

export async function DELETE(request: Request) {
    const verifyUid = await getAuthenticatedUser();
    if (!verifyUid) return NextResponse.json({ error: 'Unauthorized', status: 401 })
    try {
        const { id } = await request.json();
        if (!id) {
            return NextResponse.json(
                { error: "Missing required fields: id is required." },
                { status: 400 }
            );
        }

        // Firestore Logic
        await deleteExpense(verifyUid.uid, id)
        revalidateTag('expense-data', { expire: 0 })
        revalidateTag('budget-data', { expire: 0 })
        return NextResponse.json(
            {
                message: "Expense deleted successfully.",
                // expenseId: docRef.id,
            },
            { status: 201 }
        );


    } catch (err) {
        throw new Error('Error deleting expense: ' + err);
    }

}

export async function PUT(request: Request) {
    const verifyUid = await getAuthenticatedUser();
    if (!verifyUid) return NextResponse.json({ error: 'Unauthorized', status: 401 })

    try {
        const body = await request.json();
        if (!body && !body.id) {
            return NextResponse.json(
                { error: "Missing field, id is required." },
                { status: 400 }
            );
        }
        const { id, expenseData } = body;
        // const targetMonthTag = `expenses-${expenseData.date.substring(0, 7)}`;
        // const targetBudget = `budget-${expenseData.date.substring(0, 7)}`
        await updateExpense(verifyUid.uid, id, expenseData)
        if (!expenseData.date.includes('undefined')) {
            // revalidateTag(targetMonthTag, { expire: 0 })
            // revalidateTag(targetBudget, { expire: 0 })
            // }
            return NextResponse.json(
                {
                    message: "Expense updated successfully.",
                },
                { status: 201 }
            )
        }
    } catch (err) {
        throw new Error('Error deleting expense: ' + err);
    }
}