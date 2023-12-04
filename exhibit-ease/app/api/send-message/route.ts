import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import Pusher from 'pusher';


const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID as string,
    key: process.env.NEXT_PUBLIC_PUSHER_PUB_KEY as string,
    secret: process.env.PUSHER_SECRET_KEY as string,
    cluster: "us2",
    useTLS: true
});

export async function POST(req: NextRequest, res: NextResponse) {
    let passedValue = await new Response(req.body).text();
    let valueToJson = JSON.parse(passedValue);
    const { chatSessionId, text, senderId } = valueToJson;
    const chatChannel = `private-chat-${chatSessionId}`;

    try {
        // Save message to your database
        const message = await prisma.chatMessage.create({
            data: {
                chatId: chatSessionId,
                senderId: senderId,
                text: text,
            }
        });

        pusher.trigger(chatChannel, 'new-message', {
            id: message.id,
            text: message.text,
            senderId: message.senderId,
            delivered: message.delivered,
            read: message.read
        });

        return NextResponse.json({ message: 'Message sent', data: message });
    } catch (error) {
        console.error("Error saving message:", error);
        return NextResponse.json({ error: "Error saving message" });
    }
}
