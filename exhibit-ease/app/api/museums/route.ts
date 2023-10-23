import { prisma } from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { parseUrl } from 'next/dist/shared/lib/router/utils/parse-url';
import { NextResponse } from 'next/server';
import { parse } from 'url';

export async function GET(req: NextApiRequest, res: NextApiResponse) {
    try {
        const museums = await prisma.museum.findMany();

        return NextResponse.json(museums);
    } catch (error) {
        return NextResponse.error();
    }
}
