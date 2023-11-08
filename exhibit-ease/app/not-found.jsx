'use client'
import { useRouter, useSearchParams } from 'next/navigation';

export default function ErrorPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const message = searchParams.get('message')
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-xl w-96">
                <h1 className="text-2xl font-bold mb-4">Oops! Something went wrong.</h1>
                <p className="text-gray-600 mb-4">{message || 'An unexpected error has occurred.'}</p>
                <button
                    onClick={() => router.push('/')}
                    className="mt-4 bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 focus:outline-none focus:bg-red-700">
                    Go Home
                </button>
            </div>
        </div>
    );
}
