import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, res: NextResponse) {
    let chatSessionId;
    if (req.nextUrl.searchParams.get('chatSessionId') != undefined) {
        chatSessionId = req.nextUrl.searchParams.get('chatSessionId');
    }



    try {
        if (chatSessionId) {

            const data = await prisma.chatMessage.findMany({
                where: {
                    chatId: chatSessionId,
                }
            });
            return NextResponse.json(data);

        }
        return NextResponse.json({});

    } catch (error) {
        return NextResponse.error();
    }
    return NextResponse.json({ message: "Chat api endpoint" });
}
