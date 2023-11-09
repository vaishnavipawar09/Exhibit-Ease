import { prisma } from '@/lib/prisma';
import { MuseumType } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { parseUrl } from 'next/dist/shared/lib/router/utils/parse-url';
import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'url';

export async function GET(req: NextRequest, res: NextResponse) {
    const promoId = parseInt(req.nextUrl.searchParams.get('promoId') ?);
    try {
        if (promoId) {
            const promo = await prisma.promo.findUnique({
                where: {
                    id: promoId,
                },
            });
        }

        return NextResponse.json(promo);
    } catch (error) {
        return NextResponse.error();
    }
}