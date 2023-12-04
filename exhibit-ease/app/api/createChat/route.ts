import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, res: NextResponse) {
    let passedValue = await new Response(req.body).text();
    let valueToJson = JSON.parse(passedValue);
    const { userId } = valueToJson;
    try {
        const existingSession = await prisma.chat.findFirst({
            where: {
                customerId: userId,
            },
        });

        if (existingSession) {
            return NextResponse.json({ chatSessionId: existingSession.id });
        } else {
            const chatSession = await prisma.chat.create({
                data: {
                    customerId: userId
                },
            });
            return NextResponse.json({ chatSessionId: chatSession.id });
        }

    } catch (error) {
        console.error("Error creating chat session:", error);
        return NextResponse.json({ error: "Error creating chat session" });
    }
}

export function GET(req: NextRequest, res: NextResponse) {
    return NextResponse.json({ message: "Chat api endpoint" });
}
