import { NextResponse } from "next/server";

export async function POST() {
    const response = NextResponse.json({ status: 'success' })

    response.cookies.set('sessionToken', '', {
        maxAge: 0,
        httpOnly: true,
        path: '/'
    })

    return response;
}