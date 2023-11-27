'use client';

import { useState, useEffect, useRef } from 'react';
import { TextInput, Button, Paper, Box, Text } from '@mantine/core';
import Pusher from 'pusher-js';
import { createId } from '@paralleldrive/cuid2';
import { useSession } from 'next-auth/react';

interface iAppProps {
    data: {
        User: {
            name: string | null;
        };
        message: string;
    }[];
}

export default function Page({ data }: iAppProps) {
    const { data: session } = useSession();
    const [messages, setMessages] = useState(data);
    const [newMessage, setNewMessage] = useState('');
    const [chatSessionId, setChatSessionId] = useState<string | null>(null);
    const messageEndRef = useRef<HTMLDivElement>(null);


    // Assume user ID and chat session ID are available
    const userId = session?.user?.id;

    useEffect(() => {
        const createChatSession = async () => {
            try {
                const response = await fetch('/api/create-chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId }),
                });
                const data = await response.json();
                console.log(data);
                setChatSessionId(data.chatSessionId);
            } catch (error) {
                console.error("Failed to create chat session:", error);
            }
        };

        createChatSession();
    }, [userId]);

    useEffect(() => {
        if (!chatSessionId) return;

        const chatChannelName = `private-chat-${chatSessionId}`;
        const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_PUB_KEY as string,
            { cluster: "us2" });
        const chatChannel = pusher.subscribe(chatChannelName);

        chatChannel.bind('new-message', (data: any) => {
            setMessages((prev) => [...prev, data]);
        });

        return () => {
            chatChannel.unbind_all();
            chatChannel.unsubscribe();
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
                <Text size="lg" fw={500}>Chat Room</Text>
                <div style={{ height: 400, overflowY: 'auto', marginTop: 20 }}>
                    {messages.map((message, index) => (
                        <Box key={index} style={{ marginBottom: 12 }}>
                            <Text size="sm">HI</Text>
                            <Text>Message</Text>
                        </Box>
                    ))}
                    <div ref={messageEndRef} />
                </div>
                <TextInput
                    placeholder="Type your message"
                    value={newMessage}
                    onChange={(event) => setNewMessage(event.currentTarget.value)}
                    rightSection={
                        <Button onClick={sendMessage} color="blue">Send</Button>
                    }
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            sendMessage();
                        }
                    }}
                />
            </Paper>
        </Box>
    );
}
