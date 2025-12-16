import { NextResponse } from 'next/server'; // Yanıt için NextResponse kullanılır
import { getExpenses } from "@/lib/expenses/getExpense";
import { addExpense } from "@/lib/expenses/addExpense";
import { revalidatePath } from "next/cache";
import { deleteExpense } from "@/lib/expenses/deleteExpense";
import { updateExpense } from "@/lib/expenses/uptadeExpense";
import { getAuthenticatedUser } from '@/utils/getAuthenticatedUser';


export async function POST(request: Request) {
    const verifyUid = await getAuthenticatedUser();

    if (!verifyUid) {
        return NextResponse.json({ error: 'Unauthorized' })
    }
    try {

        const body = await request.json();
        const { amount, category, description, createdAt, paidAt } = body;

        if (!amount || !category) {
            return NextResponse.json(
                { error: "Missing required fields: amount and category are required." },
                { status: 400 }
            );
        }

        // Firestore Logic
        addExpense(body, verifyUid as string)
        revalidatePath('/dashboard/expenses')
        return NextResponse.json(
            {
                message: "Expense added successfully.",
            },
            { status: 201 }
        );


    } catch (err) {
        console.error("Error: add expense during request", err);
        // Hata yanıtı döndürün
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
            usersCollectionData = await getExpenses(verifyUid, month);
            return NextResponse.json(usersCollectionData, { status: 200 })
        } else {
            usersCollectionData = await getExpenses(verifyUid, undefined);
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
        await deleteExpense(verifyUid, id)
        revalidatePath('/dashboard/expenses')
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
        const { amount, category, description } = expenseData;

        // console.log('Put ', `Category : ${category}`)
        await updateExpense(verifyUid, id, amount, category, description)
        revalidatePath('/dashboard/expenses')
        return NextResponse.json(
            {
                message: "Expense updated successfully.",
                // expenseId: docRef.id,
            },
            { status: 201 }
        )

    } catch (err) {
        throw new Error('Error deleting expense: ' + err);
    }
}