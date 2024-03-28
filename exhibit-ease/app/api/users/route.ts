import { prisma } from '@/lib/prisma';
import { MuseumType } from '@prisma/client';
import { parseUrl } from 'next/dist/shared/lib/router/utils/parse-url';
import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'url';

export async function GET(req: NextRequest, res: NextResponse) {
    const museumdId = req.nextUrl.searchParams.get('museumId');
    try {
        const users = await prisma.user.findMany({
            where: {
                role: 'E' as MuseumType,
                ...(museumdId && { museumId: parseInt(museumdId) })
            },
        });

        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.error();
    }
}
