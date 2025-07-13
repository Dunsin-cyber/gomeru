import { NextRequest, NextResponse } from 'next/server';
import { getFromDb } from '@/utils/db';


export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
    }

    const data = await getFromDb(id);
    console.log('Fetched data:', data);

    if (!data) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data });
}
