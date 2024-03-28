import { prisma } from '@/lib/prisma';
import { parseUrl } from 'next/dist/shared/lib/router/utils/parse-url';
import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'url';
import { format } from 'date-fns';

export async function GET(req: NextRequest, res: NextResponse) {
    try {
        const bookingsData = await prisma.booking.groupBy({
            by: ['visitInfo'],
            _sum: {
              totalVisitors: true,
            },
            orderBy: {
              visitInfo: 'asc',
            },
          });
      
          const labels = bookingsData.map(item => format(new Date(item.visitInfo), 'yyyy-MM'));
          const data = bookingsData.map(item => item._sum.totalVisitors || 0);
      
          

        return NextResponse.json({ labels, data });
    } catch (error) {
        return NextResponse.error();
    }
}
