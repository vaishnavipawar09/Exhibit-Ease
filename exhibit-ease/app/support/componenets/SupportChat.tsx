'use client';

import { useState, useEffect, useRef } from 'react';
import { TextInput, Button, Paper, Box, Text, Group } from '@mantine/core';
import Pusher from 'pusher-js';
import { useSession } from 'next-auth/react';
import { Booking, ChatMessage } from '@prisma/client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

interface iAppProps {
    msgs: ChatMessage[];
    chatId: string;
}

export default function Page() {
    const { data: session } = useSession();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');

    const searchParams = useSearchParams();

    const [chatSessionId, setChatSessionId] = useState<string | null>(null);
    const [bookingData, setBookingData] = useState<Booking | null>(null);
    const messageEndRef = useRef<HTMLDivElement>(null);
    const router = useRouter();


    const userId = session?.user?.id;


    const fetchBookingDetails = async (text: string) => {
        try {

            const response = await fetch(`/api/bookings?bookingId=${text}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },

            });

            if (response.ok) {
                const data = await response.json();
                setBookingData(data);
            } else {
                console.error('Error fetching booking details:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching booking details:', error);
        }
    };

    useEffect(() => {
        setChatSessionId(searchParams.get("chatSessionId"));
        const fetchChatMessages = async () => {
            try {
                const response = await fetch(`/api/getMessages?chatSessionId=${chatSessionId}`);
                const data = await response.json();
                setMessages(data);
            } catch (error) {
                console.error("Error fetching chat messages:", error);
            }
        };

        if (chatSessionId) {
            fetchChatMessages();
        }
    }, [chatSessionId]);

    useEffect(() => {
        if (!chatSessionId) {
            return;
        };

        const chatChannelName = `chat-${chatSessionId}`;
        const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_PUB_KEY as string,
            { cluster: "us2" });
        const chatChannel = pusher.subscribe(chatChannelName);
        chatChannel.bind('new-message', (data: any) => {
            setMessages((prev) => [...prev, data]);
            if (data.text.startsWith("oid:")) {
                fetchBookingDetails(data.text.substring(4));
            }
        });


        return () => {
            pusher.unbind_all();

            pusher.unsubscribe(chatChannelName);
        };
    }, [chatSessionId]);

    const sendMessage = () => {
        if (!newMessage.trim() || !chatSessionId) return;
        fetch('/api/send-message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chatSessionId, text: newMessage, senderId: userId }),
        });

        setNewMessage('');
    };

    // Scroll to the latest message
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <Box style={{ maxWidth: 800, margin: 'auto' }}>
            <Paper shadow="xs" p="md">
                <Group justify='space-between'>
                    <Text size="lg" fw={500}>Support Chat</Text>
                    <Button color='rgba(166, 0, 0, 1)' onClick={() => { router.push("/support"); }}>Exit Chat</Button>

                </Group>
                <div style={{ height: 400, overflowY: 'auto', marginTop: 20 }}>
                    {messages && messages.map((message, index) => (
                        <Group
                            gap="xs"
                            key={index}
                            style={{ marginBottom: 12, marginRight: 10, flexDirection: 'column', alignItems: message.senderId === userId ? 'flex-end' : 'flex-start' }}
                        >
                            <Text size="md" style={{ color: "black" }}>{message.senderId === userId ? "You" : "Customer"}</Text>
                            <Paper style={{ padding: "12px", backgroundColor: message.senderId === userId ? "lightgrey" : "DodgerBlue" }}>
                                <Text>{message.text}</Text>
                            </Paper>
                        </Group>
                    ))}
                    <div ref={messageEndRef} />
                </div>
                <TextInput
                    m="md"
                    placeholder="Type your message"
                    value={newMessage}
                    onChange={(event) => setNewMessage(event.currentTarget.value)}
                    rightSection={
                        <Button onClick={sendMessage} pl="2" color="blue" variant='transparent'>Send</Button>
                    }
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            sendMessage();
                        }
                    }}
                />

            </Paper>
            <Paper shadow="xs" p="md" mt="xs">
                <Text>Locate Order Info</Text>
                {bookingData && <>
                    <h1>Booking Information</h1>
                    <p>Booking ID: {bookingData.id}</p>
                    <p>User ID: {bookingData.userId}</p>
                    <p>Name: {bookingData.name}</p>
                    <p>Payment type: {bookingData.paymentType}</p>
                    <p>Total Cost: {bookingData.totalCost}</p>
                    <p>Total tickets: {bookingData.totalVisitors}</p></>}
            </Paper>
        </Box>
    );

}