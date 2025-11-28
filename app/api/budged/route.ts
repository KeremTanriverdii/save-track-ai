import { addbudget } from "@/lib/budged/Budget";
import { getBudged } from "@/lib/budged/GetBudget";
import { Budged } from "@/lib/types/type";
import { NextResponse } from "next/server"

export async function GET(req?: Request) {
    if (!req) return 'error get budget'

    const dx = req.json();

    try {
        const data = await getBudged();

        return NextResponse.json({ data });

    } catch (error) {
        console.error("API hatası:", error);
        return new NextResponse(JSON.stringify({ message: "Veritabanı hatası" }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

export async function POST(req: Request) {
    if (!req) return 'hata var'
    const body = await req.json();
    const { budged, yearMonth } = body;
    console.log('year', yearMonth)
    const libreq = await addbudget(budged);
    return NextResponse.json({ message: 'success' })
}