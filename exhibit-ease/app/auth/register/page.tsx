'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { Alert } from '@mantine/core';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

export default function Page() {
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        resetCode: '',
        phoneNumber: '',
        password: ''
    });
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const status = await signIn('credentials', { email: formData.email, password: formData.password, callbackUrl: '/', redirect: false, role: 'C' })
                router.push('/');
            } else {
                const errorData = await response.json();
                setError(errorData.error);
            }
        } catch (error) {
            setError('An unexpected error occurred.');
        }
    };

    return (
        <div className="mt-12 flex items-center justify-center">
            <div className="p-8 border-gray-500 border bg-white rounded shadow-lg w-96">
                <h1 className="text-2xl font-bold mb-2">Customer Registration</h1>
                {error &&
                    <Alert variant="filled" color="red" withCloseButton icon={<ExclamationCircleIcon />}
                        onClose={() => { setError('') }}>
                        {error}
                    </Alert>
                }
                <form onSubmit={handleSubmit}>
                    <div className="mb-1">
                        <label className="block text-sm font-bold mb-1">Email</label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    <div className="mb-1">
                        <label className="block text-sm font-bold mb-1">Name</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    <div className="mb-1">
                        <label className="block text-sm font-bold">Reset Code (max 5 characters)</label>
                        <span className="text-xs mb-1">(Used to reset password.)</span>
                        <input
                            type="text"
                            required
                            value={formData.resetCode}
                            onChange={(e) => setFormData({ ...formData, resetCode: e.target.value })}
                            className="w-full px-3 py-2 border rounded"
                            maxLength={5}
                        />
                    </div>
                    <div className="mb-1">
                        <label className="block text-sm font-bold mb-1">Phone Number (Optional)</label>
                        <input
                            type="text"
                            value={formData.phoneNumber}
                            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    <div className="mb-1">
                        <label className="block text-sm font-bold mb-1">Password</label>
                        <input
                            type="password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    <button type="submit" className="w-full bg-black text-white p-2 mt-2 rounded hover:bg-gray-700">Register</button>
                </form>
                <p className='text-center text mt-4'>Have an account? Login <Link href={'signin'} className='text-blue-600 underline'>here</Link>!</p>
            </div>
        </div>
    );
}
