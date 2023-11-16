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
                orderBy: { id: 'asc' }
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

export async function POST(req: NextRequest, res: NextResponse) {
    let passedValue = await new Response(req.body).text();
    let valueToJson = JSON.parse(passedValue);
    try {
        const promo = await prisma.promo.upsert({
            where: {
                id: valueToJson.id,
            },
            update: {
                promoName: valueToJson.promoName,
                discountPercent: parseFloat(valueToJson.discountPercent),
                active: valueToJson.active,
            },
            create: {
                museumId: valueToJson.museumId,
                promoName: valueToJson.promoName,
                discountPercent: parseFloat(valueToJson.discountPercent),
                active: valueToJson.active,
            },
        });

        if (valueToJson.id == 0) {
            const favorites = await prisma.favorite.findMany({
                where: {
                    museumId: promo.museumId,
                },
                select: {
                    userId: true,
                },
            });

            // Create a notification for each user
            const notifications = favorites.map(fav => ({
                userId: fav.userId,
                promoId: promo.id,
                message: `New promo available: ${promo.promoName} for ${(promo.discountPercent * 100).toFixed(1)}% off at ${valueToJson.museumName}!`,
                museumId: promo.museumId,
            }));

            await prisma.notification.createMany({
                data: notifications,
            });
        }
        return NextResponse.json(promo);
    } catch (error) {
        console.log(error);
        return NextResponse.error();
    }
}