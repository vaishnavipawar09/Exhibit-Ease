'use client';

import { useState, useEffect, useRef } from 'react';
import { TextInput, Button, Paper, Box, Text, Group } from '@mantine/core';
import Pusher from 'pusher-js';
import { createId } from '@paralleldrive/cuid2';
import { useSession } from 'next-auth/react';
import { ChatMessage } from '@prisma/client';
import { prisma } from '@/lib/prisma';

interface iAppProps {
    msgs: ChatMessage[];
}

export default function Page({ msgs }: iAppProps) {
    const { data: session } = useSession();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [chatSessionId, setChatSessionId] = useState<string | null>(null);
    const messageEndRef = useRef<HTMLDivElement>(null);


    const userId = session?.user?.id;
    useEffect(() => {
        const savedChatSessionId = window.localStorage.getItem('chatSessionId');
        if (savedChatSessionId) {
            setChatSessionId(savedChatSessionId);
        } else {
            createChatSession();
        }
    }, [session?.user?.id]);



    const createChatSession = async () => {
        if (session?.user?.id) {
            try {
                const response = await fetch('http://localhost:3000/api/createChat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId }),
                });
                const data = await response.clone().json();

                setChatSessionId(data.chatSessionId);
                window.localStorage.setItem('chatSessionId', data.chatSessionId);
            } catch (error) {
                console.error("Failed to create chat session:", error);
            }
        }
    };

    useEffect(() => {
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
                <Text size="lg" fw={500}>Support Chat</Text>
                <div style={{ height: 400, overflowY: 'auto', marginTop: 20 }}>
                    {messages && messages.map((message, index) => (
                        <Group
                            key={index}
                            style={{ marginBottom: 12, marginRight: 10, flexDirection: 'column', alignItems: message.senderId === userId ? 'flex-end' : 'flex-start' }}
                        >
                            <Text size="sm" style={{ color: "grey" }}>{message.senderId === userId ? "You" : "Support"}</Text>
                            <Paper style={{ padding: "12px", backgroundColor: message.senderId === userId ? "lightgrey" : "DodgerBlue" }}>
                                <Text>{message.text}</Text>
                            </Paper>
                            {message.senderId === userId ? <Text size="xs" style={{ color: "grey" }}>{message.delivered ? "Delivered" : "Read"}</Text> : null}

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
                <Text size="xs">Send "oid:YOUR_ORDER_ID" (no spaces) for specific order info. Can be found under "Your Orders" in the <a className='text-red-400' href="/dashboard">Dashboard</a>.</Text>
            </Paper>
        </Box>
    );
}