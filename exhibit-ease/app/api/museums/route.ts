import { prisma } from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
import { parse } from 'url';

export async function GET(req: NextApiRequest, res: NextApiResponse) {
    try {
        // console.log(req.nextUrl.searchParams.get("foo"))
        console.log(req.query)
        const museums = await prisma.museum.findMany({
            where: {
                ...req.query
            }
        });

        return NextResponse.json(museums);
    } catch (error) {
        return NextResponse.error();
    }
}
