'use client'

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Museum } from '@prisma/client';
import Image from "next/image";

export default function BookingPage() {
    const searchParams = useSearchParams();
    const [museums, setMuseums] = useState<Museum[]>([]);
    useEffect(() => {
        async function fetchMuseums() {
            try {
                const res = await fetch('/api/museums'); // Using relative URL
                const data = await res.json();
                setMuseums(data.find((museum: Museum) => museum.id === parseInt(searchParams?.get('id') || '1')));
            } catch (error) {
                console.error("Error fetching museums:", error);
                // Handle the error, e.g. show a notification or message to the user
            }
        }

        fetchMuseums();
    }, []);

    return (
        <div>
            <div className="hero h-3/4"
                style={{ backgroundImage: `linear-gradient(rgba(255, 255, 255, .6), rgba(255, 255, 255, .6)), url('${museums[0]?.bg_image}')` }}>

                <div className="hero-content flex-col lg:flex-row">
                    {museums && (
                        <Image
                            src={museums[0].main_image || ""}
                            alt={museums[0].name}
                            width={100}
                            height={100}
                            className="w-[100px] h-[100px] rounded-xl border-black border-[3px] max-w-sm shadow-2xl"
                        />
                    )}
                    <div className='mx-auto text-center'>
                        <h1 className="text-6xl font-bold mb-4 text-center">{museums[0]?.name}</h1>
                        <div className="flex flex-col items-center"></div>
                    </div>
                </div>
            </div>
            <p className="text-lg font-bold mb-4">Number of tickets (1-10) :</p>
            <input className="rounded-xl border-black border-[3px] max-w-sm shadow-2xl" type="number" pattern="[0-9]*"
                onInput={() => { }} value={1} />
        </div>

    );
}
