import { prisma } from '@/lib/prisma';
import { MuseumType } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { parseUrl } from 'next/dist/shared/lib/router/utils/parse-url';
import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'url';

export async function GET(req: NextRequest, res: NextResponse) {
    let promoId
    if (req.nextUrl.searchParams.get('promoId') != undefined) {
        promoId = parseInt(req.nextUrl.searchParams.get('promoId') || '0', 10);
    }

    let museumId
    if (req.nextUrl.searchParams.get('museumId') != undefined) {
        museumId = parseInt(req.nextUrl.searchParams.get('museumId') || '0', 10);
    }

    try {
        if (promoId) {
            const promo = await prisma.promo.findUnique({
                where: {
                    id: promoId,
                },
            });
            return NextResponse.json(promo);
        } else if (museumId) {
            const promo = await prisma.promo.findMany({
                where: {
                    museumId: museumId,
                },
            });
            return NextResponse.json(promo);
        } else {
            const promo = await prisma.promo.findMany({

            });
            return NextResponse.json(promo);
        }


    } catch (error) {
        console.log(error);
        return NextResponse.error();
    }
}