import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, res: NextResponse) {
    let repId;
    if (req.nextUrl.searchParams.get('repId') != undefined) {
        repId = req.nextUrl.searchParams.get('repId');
    }

    try {
        if (repId) {

            const data = await prisma.chat.findMany({
                where: {
                    OR: [
                        { supportRepId: null },
                        { supportRepId: repId }
                    ],
                },
                include: {
                    customer: true,
                }
            });
            return NextResponse.json(data);

        }
        return NextResponse.json({});

    } catch (error) {
        return NextResponse.error();
    }
}
