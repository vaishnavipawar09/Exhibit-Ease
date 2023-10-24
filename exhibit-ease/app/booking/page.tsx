'use client'

import { useSearchParams } from 'next/navigation';
import BookingMuseumData from '../components/BookingMuseumData';

export default function BookingPage() {
    const searchParams = useSearchParams();


    return (
        <div>
            Looking at museum no. {searchParams?.get('id')}.
            < BookingMuseumData museumID={parseInt(searchParams?.get('id') || '1')} />
        </div>
    );
}
