import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, res: NextResponse) {
    let userId
    if (req.nextUrl.searchParams.get('userId') != undefined) {
        userId = req.nextUrl.searchParams.get('userId');
    }

    try {

        if (userId) {
            const notifs = await prisma.notification.findMany({
                where: {
                    userId: userId,
                },
                orderBy: { id: 'desc' }
            });
            return NextResponse.json(notifs);
        }

        return NextResponse.json("No user id provided", { status: 400 });


    } catch (error) {
        console.log(error);
        return NextResponse.error();
    }
}

export async function POST(req: NextRequest, res: NextResponse) {
    let passedValue = await new Response(req.body).text();
    console.log(passedValue);
    let valueToJson = JSON.parse(passedValue);
    try {
        const promo = await prisma.notification.update({
            where: {
                id: valueToJson.id,
            },
            data: {
                read: valueToJson.read,
            }
        });

        return NextResponse.json(promo);
    } catch (error) {
        console.log(error);
        return NextResponse.error();
    }
}