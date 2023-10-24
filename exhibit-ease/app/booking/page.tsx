'use client'

import { useSearchParams } from 'next/navigation';
import BookingMuseumData from '../components/BookingMuseumData';

export default function BookingPage() {
    const searchParams = useSearchParams();


    return (
        <div>
            <BookingMuseumData museumID={parseInt(searchParams?.get('id') || '1')} />
            <p className="text-lg font-bold mb-4">Number of tickets (1-10) :</p>
            <input className="rounded-xl border-black border-[3px] max-w-sm shadow-2xl" type="number" pattern="[0-9]*"
                onInput={() => { }} value={1} />
        </div>

    );
}
