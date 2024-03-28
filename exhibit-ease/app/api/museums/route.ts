import { prisma } from '@/lib/prisma';
import { parseUrl } from 'next/dist/shared/lib/router/utils/parse-url';
import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'url';

export async function GET(req: NextRequest, res: NextResponse) {
    try {
        const museums = await prisma.museum.findMany();

        return NextResponse.json(museums);
    } catch (error) {
        return NextResponse.error();
    }
}
