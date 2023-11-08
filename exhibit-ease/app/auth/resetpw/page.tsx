'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { Alert } from '@mantine/core';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

export default function Register() {
    type FormData = {
        email: string;
        resetCode: string;
        password: string | null;
        needToVerify: boolean;
    };
    const [formData, setFormData] = useState<FormData>({
        email: '',
        resetCode: '',
        password: null,
        needToVerify: true,
    });

    const [error, setError] = useState('');
    const [resetCodeVerified, setResetCodeVerified] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // If we've already verified the code and are now resetting the password
        if (resetCodeVerified) {
            // Call the API to reset the password
            // Assuming '/api/reset-password' is your endpoint for the password update
            try {
                const resetResponse = await fetch('/api/reset-password', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: formData.email,
                        password: formData.password, // Make sure to handle the case when password is null
                    }),
                });

                if (resetResponse.ok) {
                    const res = await resetResponse.json();
                    if (res.message === 'updated') {
                        await signIn('credentials', {
                            email: formData.email,
                            password: formData.password,
                            callbackUrl: '/',
                            redirect: false,
                            role: 'C'
                        });
                        router.push('/');
                    }
                } else {
                    // Handle the error case
                    const errorData = await resetResponse.json();
                    setError(errorData.error);
                }
            } catch (error) {
                setError('An unexpected error occurred.');
            }
        } else {
            // Call the API to verify the reset code
            try {
                const verifyResponse = await fetch('/api/verify-reset-code', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: formData.email,
                        resetCode: formData.resetCode,
                    }),
                });

                if (verifyResponse.ok) {
                    const res = await verifyResponse.json();
                    if (res.message === 'verified') {
                        setError('');
                        setResetCodeVerified(true);
                    }
                } else {
                    const errorData = await verifyResponse.json();
                    setError(errorData.error);
                }
            } catch (error) {
                setError('An unexpected error occurred.');
            }
        }
    }
    return (
        <div className="mt-12 flex items-center justify-center">
            <div className="p-8 border-gray-500 border bg-white rounded shadow-lg w-96">
                <h1 className="text-2xl font-bold mb-4">Customer Password Reset</h1>
                {error &&
                    <Alert variant="filled" color="red" withCloseButton icon={<ExclamationCircleIcon />}
                        onClose={() => { setError('') }}>
                        {error}
                    </Alert>
                }
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-bold mb-2">Email</label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-bold">Reset Code</label>
                        <input
                            type="text"
                            required
                            value={formData.resetCode}
                            onChange={(e) => setFormData({ ...formData, resetCode: e.target.value })}
                            className="w-full px-3 py-2 border rounded"
                            maxLength={5}
                        />
                    </div>
                    {resetCodeVerified && <div className="mb-4">
                        <label className="block text-sm font-bold mb-2">Password</label>
                        <input
                            type="password"
                            required
                            value={formData.password !== null ? formData.password : ''}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>}
                    <button type="submit" className="w-full bg-black text-white p-2 rounded hover:bg-gray-700">Reset Password</button>
                </form>
                <p className='text-center text mt-4'>Changed your mind? Go <Link href={'signin'} className='text-blue-600 underline'>login</Link>!</p>
            </div>
        </div>
    );
}
