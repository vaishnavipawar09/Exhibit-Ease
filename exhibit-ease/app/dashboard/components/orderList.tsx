'use client';

import React, { FC, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@mantine/core'


export default function Page() {
    const { data: session } = useSession();
    const userId = session?.user?.id;
    const [orders, setOrders] = useState<{ id: string }[]>([]);

    useEffect(() => {
        const fetchBookingDetails = async () => {
            try {
                if (!userId) {
                    console.error('User ID not found');
                    return;
                }

                const response = await fetch(`/api/orders?userId=${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setOrders(data);
                    console.log(data);
                } else {
                    console.error('Error fetching booking details:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching booking details:', error);
            }
        };

        fetchBookingDetails();
    }, [userId]);


    async function fetchMuseumInfo(museumId: String) {
        const response = await fetch(`/api/museums?museumId=${museumId}`, {
            method: 'Get',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const data = await response.json();
            return data.name
        } else {
            const errorData = await response.json();
        }
    }

    return (
        <div>
            <h1>User Orders</h1>
            <ul>
                {orders.map((order: any) => (
                    <li key={order.id}>
                        <strong>Order ID:</strong> {order.id}
                        <p><Button component="a" color='rgba(166, 0, 0, 1)' href={`/confirmation?id=${order.id}`} style={{ margin: '1.25rem 0' }}>View booking detail</Button></p>
                        <hr style={{ margin: '0.5rem 0', borderColor: 'gray' }} />
                    </li>
                ))}
            </ul>
        </div>
    );
}
