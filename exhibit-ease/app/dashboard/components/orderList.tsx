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

    return (
        <div>
            <h1>User Orders</h1>
            <ul>
                {orders.map((order: any) => (
                    <li key={order.id}>
                        <strong>Museum Name:</strong> {order.museum.name} <br />
                        Order ID: {order.id} <br />
                        Total: {order.totalCost} <br />
                        Visit Date: {order.visitInfo} <br />
                        <p><Button component="a" color='rgba(166, 0, 0, 1)' href={`/confirmation?id=${order.id}`} style={{ margin: '1.25rem 0' }}>View booking detail</Button></p>
                        <hr style={{ margin: '0.5rem 0', borderColor: 'gray' }} />
                    </li>
                ))}
            </ul>
        </div>
    );
}
