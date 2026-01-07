import { NextResponse } from "next/server";
import { GoogleGenAI } from '@google/genai'
import { writeResults } from "@/lib/ai-respons/writeResults";
import { deleteDataById } from "@/lib/ai-respons/deleteResults";
import { getAuthenticatedUser } from "@/utils/getAuthenticatedUser";
import { revalidateTag } from "next/cache";
import { ButtonAiComponentProps } from "@/lib/types/type";



export async function POST(req: Request) {
    const verifyUid = await getAuthenticatedUser();
    if (!verifyUid) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const body: ButtonAiComponentProps = await req.json();
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        const { requestData, currentMonth } = body;
        const { dailyData, summary } = requestData;

        const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

        const prompt = `
        You are a personal finance coach.

Your task is to analyze the user's monthly spending behavior using the JSON data provided. 
This data includes totals, averages, category distributions, daily spending, anomalies, and spending trends.

Your responsibilities:
1. Evaluate the user’s overall budget performance for the month.
2. Identify the riskiest spending category and explain why.
3. Comment on daily spending patterns (consistency, spikes, unusual days).
4. Interpret the trend data (is spending rising or falling? why might this be happening?).
5. Provide exactly 3 actionable and realistic suggestions the user can apply immediately.
6. Keep the tone calm, concise, and informative.
7. Avoid generic advice; use the provided numbers meaningfully.
8. Do not include any text outside the JSON structure.

Input data will be provided as a JSON object here:
{{analyticsInput}}

You must respond **strictly in the following JSON format**:

{
  "summary": "A brief 2–3 sentence overview of the user’s financial performance.",
  "risks": [
    "A short sentence describing the most problematic category or pattern."
  ],
  "patterns": [
    "A concise observation about daily spending or anomalies."
  ],
  "suggestions": [
    "Actionable suggestion 1",
    "Actionable suggestion 2",
    "Actionable suggestion 3"
  ]
} ` .replace('{{analyticsInput}}', JSON.stringify(body));

        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: 'object',
                    properties: {
                        summary: { type: 'string' },
                        risks: {
                            type: 'array',
                            items: { type: 'string' },
                            description: 'The most problematic category or pattern'
                        },
                        patterns: {
                            type: 'array',
                            items: { type: 'string' },
                            description: 'Observations about daily spending or anomalies'
                        },
                        suggestions: {
                            type: 'array',
                            items: { type: 'string' },
                            description: 'Exactly 3 actionable suggestions'
                        }
                    },
                    required: ['summary', 'risks', 'patterns', 'suggestions']
                }
            }
        });
        const geminiResponseText = response.text;

        let insightData: {
            summary: string;
            risks: string[];
            patterns: string[];
            suggestions: string[];
        } | null = null;
        try {
            insightData = JSON.parse(geminiResponseText as string);
        } catch (parseError) {
            console.error('Error parsing Gemini response:', parseError);
            return NextResponse.json({ message: 'Error parsing AI response', status: 500 });
        }

        if (insightData) {
            // await saveTheFirestoreInsight(insightData);
            await writeResults(verifyUid.uid, insightData);
            revalidateTag('ai-insights', { expire: 0 })
        } else {
            console.error('No insight data to save to Firestore.');
        }

        // Implement actual Firestore saving logic here
        return NextResponse.json({ data: insightData, status: 200 });
    } catch (err) {
        return NextResponse.json({ message: 'error', status: 500 });
    }
}

export async function DELETE(req: Request) {
    const verifyUid = await getAuthenticatedUser();
    if (!verifyUid) return NextResponse.json({ error: 'Unauthorized', status: 401 })

    try {
        const body = await req.json();
        const { id } = body;

        if (!id) {
            return NextResponse.json({ message: 'error', status: 500 });
        } else {
            await deleteDataById(verifyUid.uid, id);
            revalidateTag('ai-insights', { expire: 0 })
            return NextResponse.json({ message: 'success', status: 200 })
        }
    } catch (err) {
        return NextResponse.json({ message: 'error', status: 500 });
    }

}