'use client'
import { useSearchParams } from 'next/navigation';
import { ChangeEvent, useEffect, useState } from 'react';
import { Museum } from '@prisma/client';

export default function BookingPage() {
    const [museums, setMuseums] = useState<Museum | null>(null);
    const searchParams = useSearchParams();

    useEffect(() => {
        async function fetchMuseums() {
            try {
                const res = await fetch('/api/museums');
                if (!res.ok) {
                    throw new Error(`Fetch request failed with status: ${res.status}`);
                }
                const data = await res.json();
                const museumId = parseInt(searchParams?.get('id') || '1');
                const selectedMuseum = data.find((museum: Museum) => museum.id === museumId);
                setMuseums(selectedMuseum);
            } catch (error) {
                console.error("Error fetching museums:", error);
                // Handle the error, e.g., show an error message to the user
            }
        }

        fetchMuseums();
    }, []);

    return <div> confirmation page </div>
}