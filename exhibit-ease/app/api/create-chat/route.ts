import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, res: NextResponse) {
    let passedValue = await new Response(req.body).text();
    let valueToJson = JSON.parse(passedValue);
    const { userId } = valueToJson;
    console.log(userId);
    try {
        // Create a new chat session in the database
        const chatSession = await prisma.chat.create({
            data: {
                customerId: userId
            },
        });
        console.log(chatSession.id);
        NextResponse.json({ chatSessionId: chatSession.id });
    } catch (error) {
        console.error("Error creating chat session:", error);
        NextResponse.json({ error: "Error creating chat session" });
    }

}
