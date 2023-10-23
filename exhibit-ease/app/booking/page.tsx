'use client'

import { useSearchParams } from 'next/navigation';

export default function BookingPage() {
    const searchParams = useSearchParams();
    return (
        <div>
            Looking at museum no. {searchParams.get('id')}.
        </div>
    );
}
