import { prisma } from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
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
            const book = await prisma.booking.findMany({
                where: {
                    userId: userId,
                    museumId: museumId
                },
            });
        }
        if (userId && !museumId) {
            const book = await prisma.booking.findMany({
                where: {
                    userId: userId,
                },
            });
            return NextResponse.json(book);
        }
        return NextResponse.json({});

    } catch (error) {
        return NextResponse.error();
    }
}

export async function POST(req: NextApiRequest, res: NextApiResponse) {
    try {
        let passedValue = await new Response(req.body).text();
        let valueToJson = JSON.parse(passedValue);
        const { userId, museumId, name, visitInfo, paymentType, totalCost, employeeBooked, totalVisitors, creditCardInfoId } = valueToJson;

        const booking = await prisma.booking.create({
            data: {
                userId: userId,
                museumId: museumId,
                name: name,
                visitInfo: visitInfo,
                paymentType: paymentType,
                totalCost: totalCost,
                employeeBooked: employeeBooked,
                totalVisitors: totalVisitors,
                creditCardInfoId: creditCardInfoId
            },
        });

        return NextResponse.json({ booking }, { status: 200 });

    } catch (error) {
        console.error("Error creating booking:", error);
        return NextResponse.json({ error: 'An error occurred.' }, { status: 500 });
    }
};