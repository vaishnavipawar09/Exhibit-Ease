import { prisma } from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, res: NextResponse) {
    try {
        const bookingId = req.nextUrl.searchParams.get('bookingId') || '0';

        if (!bookingId) {
            return NextResponse.json({ error: 'Invalid bookingId' }, { status: 400 });
        }

        const booking = await prisma.booking.findUnique({
            where: {
                id: bookingId,
            },
        });

        if (!booking) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        return NextResponse.json(booking);

    } catch (error) {
        console.error('Error fetching booking details:', error);
        return NextResponse.error();
    } finally {
        await prisma.$disconnect();
    }
}

export async function POST(req: NextApiRequest, res: NextApiResponse) {
    try {
        let passedValue = await new Response(req.body).text();
        let valueToJson = JSON.parse(passedValue);
        const { userId, museumId, name, visitInfo, paymentType, totalCost, employeeBooked, totalVisitors, creditCardInfoId } = valueToJson;
        console.log(valueToJson);
        const booking = await prisma.booking.create({
            data: {
                name: name,
                visitInfo: visitInfo,
                paymentType: paymentType,
                totalCost: totalCost,
                employeeBooked: employeeBooked,
                totalVisitors: totalVisitors,
                creditCardInfo: { connect: { id: creditCardInfoId } },
                museum: { connect: { id: museumId } },
                user: { connect: { id: userId } }
            },
        });

        return NextResponse.json({ booking }, { status: 200 });

    } catch (error) {
        console.error("Error creating booking:", error);
        return NextResponse.json({ error: 'An error occurred.' }, { status: 500 });
    }
};