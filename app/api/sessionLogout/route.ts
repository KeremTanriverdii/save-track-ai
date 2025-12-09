import { NextResponse } from "next/server";

export async function POST() {
    const response = NextResponse.json({ status: 'success' })

    response.cookies.set('session', '', {
        maxAge: 0,
        httpOnly: true,
        path: '/'
    })

    return response;
}