import { NextResponse } from 'next/server'; // Yanıt için NextResponse kullanılır
import { getExpenses } from "@/lib/expenses/getExpense";
import { addExpense } from "@/lib/expenses/addExpense";
import { revalidatePath } from "next/cache";
import { deleteExpense } from "@/lib/expenses/deleteExpense";
import { updateExpense } from "@/lib/expenses/uptadeExpense";
// 🎯 Test için Sabit Kullanıcı Kimliği

const TEST_USER_ID = "testUserId_42";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { amount, category, description, createdAt, paidAt } = body;
        if (!amount || !category) {
            return NextResponse.json(
                { error: "Eksik veri: amount ve category gereklidir." },
                { status: 400 }
            );
        }

        // Firestore Logic
        addExpense(body)
        revalidatePath('/dashboard/expenses')
        return NextResponse.json(
            {
                message: "Gider başarıyla eklendi.",
                // expenseId: docRef.id,
            },
            { status: 201 }
        );


    } catch (err) {
        console.error("Firestore'a veri eklenirken hata oluştu:", err);
        // Hata yanıtı döndürün
        return NextResponse.json(
            { error: "Sunucu hatası: Gider eklenemedi." },
            { status: 500 }
        );
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const month = searchParams.get('yearMonth')
        let usersCollectionData

        if (month) {
            usersCollectionData = await getExpenses(month);
            return NextResponse.json(usersCollectionData, { status: 200 })
        } else {
            usersCollectionData = await getExpenses();
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
    try {
        const { id } = await request.json();
        if (!id) {
            return NextResponse.json(
                { error: "Eksik veri: id gereklidir." },
                { status: 400 }
            );
        }

        // Firestore Logic
        await deleteExpense(id)
        revalidatePath('/dashboard/expenses')
        return NextResponse.json(
            {
                message: "Gider başarıyla silindi.",
                // expenseId: docRef.id,
            },
            { status: 201 }
        );


    } catch (err) {
        throw new Error('Error deleting expense: ' + err);
    }

}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        if (!body && !body.id) {
            return NextResponse.json(
                { error: "Eksik veri: id gereklidir." },
                { status: 400 }
            );
        }
        const { id, expenseData } = body;
        const { amount, category, description } = expenseData;

        // console.log('Put ', `Category : ${category}`)
        await updateExpense(id, amount, category, description)
        revalidatePath('/dashboard/expenses')
        return NextResponse.json(
            {
                message: "Gider başarıyla güncellendi.",
                // expenseId: docRef.id,
            },
            { status: 201 }
        )

    } catch (err) {
        throw new Error('Error deleting expense: ' + err);
    }
}