'use client'
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { QRCode } from 'react-qrcode-logo';

export default function Page() {
    const searchParams = useSearchParams();
    const [bookingData, setBookingData] = useState<{ id: string; name: string; totalCost: number, totalVisitors: number, userId: string, paymentType: string, bookingMade: String, visitInfo: String } | null>(null);
    const currentUrl = window.location.href;

    useEffect(() => {
        const fetchBookingDetails = async () => {
            try {
                const bookingId = searchParams?.get('id');

                if (!bookingId) {
                    console.error('Booking ID not found in URL');
                    return;
                }

                const response = await fetch(`/api/bookings?bookingId=${bookingId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },

                });

                if (response.ok) {
                    const data = await response.json();
                    setBookingData(data);
                    console.log(data)
                } else {
                    console.error('Error fetching booking details:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching booking details:', error);
            }
        };

        fetchBookingDetails();
    }, [searchParams]);

    if (!bookingData) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Booking Information</h1>
            <p>Booking ID: {bookingData.id}</p>
            <p>User ID: {bookingData.userId}</p>
            <p>Name: {bookingData.name}</p>
            <p>Payment type: {bookingData.paymentType}</p>
            <p>Total Cost: {bookingData.totalCost}</p>
            <p>Total tickets: {bookingData.totalVisitors}</p>
            <p>Time of Purchase: {bookingData.bookingMade}</p>
            <p>Time of Reservation: {bookingData.visitInfo}</p>
            <QRCode value={currentUrl} />

        </div>
    );
}
