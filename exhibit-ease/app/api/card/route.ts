import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, res: NextResponse) {
    let userId
    if (req.nextUrl.searchParams.get('userId') != undefined) {
        userId = req.nextUrl.searchParams.get('userId');
    }

    try {
        if (userId) {
            const cc = await prisma.creditCardInfo.findMany({
                where: {
                    userId: userId
                },
            });
            if (cc.length > 0) {
                return NextResponse.json(cc[0]);
            } else {
                return NextResponse.json({});
            }
        }
        return NextResponse.json({});

    } catch (error) {
        return NextResponse.error();
    }
}

export async function POST(req: NextRequest, res: NextResponse) {
    let passedValue = await new Response(req.body).text();
    let valueToJson = JSON.parse(passedValue);
    const { id, userId, cardNumber, expiration, securityCode, zipcode } = valueToJson;

    try {

        const fav = await prisma.creditCardInfo.upsert({
            where: { id: id },
            update: {
                cardNumber: cardNumber,
                expiration: expiration,
                securityCode: securityCode,
                zipcode: zipcode,
            },
            create: {
                userId: userId,
                cardNumber: cardNumber,
                expiration: expiration,
                securityCode: securityCode,
                zipcode: zipcode,
            }
        });

        return NextResponse.json({ fav }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: 'An error occurred.' }, { status: 500 });
    }
};
