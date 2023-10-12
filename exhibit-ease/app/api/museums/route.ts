import { prisma } from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { parseUrl } from 'next/dist/shared/lib/router/utils/parse-url';
import { NextResponse } from 'next/server';
import { parse } from 'url';

export async function GET(req: NextApiRequest, res: NextApiResponse) {
    try {
        var parsedUrl = parse(req.url || '', true);
        var total = undefined;

        if (parsedUrl.query.take != undefined) {
            total = parseInt(parsedUrl.query.take as string);
            delete parsedUrl.query.take;
        }

        const museums = await prisma.museum.findMany({
            where: {
                ...parsedUrl.query
            },
            take: total
        });

        return NextResponse.json(museums);
    } catch (error) {
        return NextResponse.error();
    }
}
