// app/api/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { saveToDb } from '@/utils/db';

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { id, content, price, creator, lud16 } = body;

    if (!id || !content || !price || !lud16) {
        return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const payload = {
        id,
        content,
        price,
        creator,
        lud16,
        createdAt: Date.now(),
    };

    saveToDb(id, payload);
    return NextResponse.json({ success: true });
}
