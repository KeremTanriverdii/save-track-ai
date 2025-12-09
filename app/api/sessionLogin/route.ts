import admin from "@/lib/firebase/admin";
import { NextResponse } from "next/server";

const EXPIRES_IN = 60 * 60 * 24 * 5 * 1000;

export async function POST(req: Request) {
    const authorizationHeader = req.headers.get('Authorization');

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const idToken = authorizationHeader.split('Bearer ')[1];

    try {
        await admin.auth().verifyIdToken(idToken);
        const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn: EXPIRES_IN });
        const optionsCookie = {
            name: 'session',
            value: sessionCookie,
            maxAge: EXPIRES_IN,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
        };

        const response = NextResponse.json({ status: 'success' });
        response.cookies.set(optionsCookie);
        return response;
    } catch (err) {
        console.error('Token authorization error DETAIL:', err);

        // Geliştirme aşamasında client tarafına da hata mesajını gönderin.
        const errorMessage = (err instanceof Error) ? err.message : 'Unknown authorization error';

        // 401 Unauthorized yanıtı döndürülüyor.
        return NextResponse.json(
            { error: 'Unauthorized', detail: errorMessage },
            { status: 401 }
        );
    }
}