import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, res: NextResponse) {
    let userId
    if (req.nextUrl.searchParams.get('userId') != undefined) {
        userId = req.nextUrl.searchParams.get('userId');
    }

    let museumId
    if (req.nextUrl.searchParams.get('museumId') != undefined) {
        museumId = parseInt(req.nextUrl.searchParams.get('museumId') || '0', 10);
    }

    try {
        if (userId && museumId) {
            const fav = await prisma.favorite.findMany({
                where: {
                    userId: userId,
                    museumId: museumId
                },
            });
            if (fav.length > 0) {
                return NextResponse.json(true);
            } else {
                return NextResponse.json(false)
            }
        }
        if (userId && !museumId) {
            const fav = await prisma.favorite.findMany({
                where: {
                    userId: userId,
                },
            });
            return NextResponse.json(fav);
        }
        return NextResponse.json({});

    } catch (error) {
        return NextResponse.error();
    }
}

export async function POST(req: NextRequest, res: NextResponse) {
    let passedValue = await new Response(req.body).text();
    let valueToJson = JSON.parse(passedValue);
    const { userId, museumId } = valueToJson;

    try {

        const fav = await prisma.favorite.create({
            data: {
                userId: userId,
                museumId: museumId
            },
        });

        return NextResponse.json({ fav }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: 'An error occurred.' }, { status: 500 });
    }
};

export async function DELETE(req: NextRequest, res: NextResponse) {
    let passedValue = await new Response(req.body).text();
    let valueToJson = JSON.parse(passedValue);
    const { userId, museumId } = valueToJson;

    try {

        const fav = await prisma.favorite.deleteMany({
            where: {
                userId: userId,
                museumId: museumId
            },
        });

        return NextResponse.json({ fav }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: 'An error occurred.' }, { status: 500 });
    }
};
