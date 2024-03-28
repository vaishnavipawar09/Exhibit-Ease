import { prisma } from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, res: NextResponse) {
    try {
        const userId = req.nextUrl.searchParams.get('userId') || '0';

        if (!userId) {
            return NextResponse.json({ error: 'Invalid userId' }, { status: 400 });
        }

        const booking = await prisma.booking.findMany({
            where: {
                userId: userId,
            },
            include: {
                museum: true,
            }
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
