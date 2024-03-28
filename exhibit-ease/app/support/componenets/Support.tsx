'use client';

import { Box, Button, Group, Paper, Text } from "@mantine/core";
import { Chat, User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'

interface ChatInter {
    customer: User
    customerId: string
    suppprtRepId: string
    id: string
}

export default function Page() {
    const [chats, setChats] = useState<ChatInter[]>([]);
    const { data: session } = useSession();

    const router = useRouter();

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const response = await fetch(`/api/getChats?repId=${session?.user?.id}`);
                const data = await response.json();
                setChats(data);
            } catch (error) {
                console.error("Error fetching chats:", error);
            }
        };
        fetchChats()

        const intervalId = setInterval(() => {
            fetchChats()
        }, 20000);

        return () => clearInterval(intervalId);
    }, [setChats]);


    return <>
        <Text pb="2">Pending support chats:</Text>
        {chats && chats.map(chat => {
            return <Paper key={chat.id} shadow="xs" p="md">
                <Group justify="space-between">Chat from: {chat.customer.name} <Button onClick={() => router.push(`/support/suppChat?chatSessionId=${chat.id}`)} color='rgba(166, 0, 0, 1)'>Accept Chat</Button></Group></Paper>
        })}
    </>
}