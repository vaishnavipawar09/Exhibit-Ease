'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { Alert } from '@mantine/core';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

export default function Register() {
    const [formData, setFormData] = useState({
        email: '',
        name: '',
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
        <div className="mt-12 flex items-center justify-center bg-gray-100">
            <div className="p-8 bg-white rounded shadow-lg w-96">
                <h1 className="text-2xl font-bold mb-4">Customer Registration</h1>
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
                        <label className="block text-sm font-bold mb-2">Name</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-bold mb-2">Phone Number (Optional)</label>
                        <input
                            type="text"
                            value={formData.phoneNumber}
                            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-bold mb-2">Password</label>
                        <input
                            type="password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    <button type="submit" className="w-full bg-black text-white p-2 rounded hover:bg-gray-700">Register</button>
                </form>
                <p className='text-center text mt-4'>Have an account? Login <Link href={'signin'} className='text-blue-600 underline'>here!</Link></p>
            </div>
        </div>
    );
}
