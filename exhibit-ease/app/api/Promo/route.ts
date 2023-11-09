import { prisma } from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

export async function GET(req: NextApiRequest, res: NextApiResponse) {
    try {
        const promo = await prisma.promo.findMany();

        return NextResponse.json(promo);
    } catch (error) {
        return NextResponse.error();
    }
}
