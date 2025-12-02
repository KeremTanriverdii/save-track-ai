import { NextResponse } from "next/server";
import { GoogleGenAI } from '@google/genai'



export async function POST(req: Request) {
    // if (!req) return 'No req data';

    try {
        const body = await req.json();
        const { analytics, insights } = body;

        const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

        const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

        const prompt = 'Hello, this is a prompt. Write me 10 words about AI.'
        async function AiWithInsight() {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt
            })
            console.log(response.text);
            return response.text;
        }
        AiWithInsight();
        return NextResponse.json({ AiWithInsight: AiWithInsight(), message: 'success', status: 200 })

    } catch (err) {
        return NextResponse.json({ message: 'error', status: 500 });
    }
} 