'use client'

import { SetStateAction, useEffect, useState } from 'react';
import { getSession, signIn } from "next-auth/react";
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation'
import Link from 'next/link';
import { Alert, Divider, Notification } from '@mantine/core';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

var fieldCSS: string = "border-black border w-full px-3 py-2 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:shadow-outline-gray focus:border-gray-300"
var buttonCSS: string = "w-full py-2 px-4 mb-3 flex items-center justify-center space-x-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2"

interface UniversalLoginProps {
    isCustomer?: boolean;
    error: string;
    setError: React.Dispatch<SetStateAction<string>>;
}

function UniversalLogin({ isCustomer = true, error, setError }: UniversalLoginProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [emailOrPhone, setEmailOrPhone] = useState('');
    const [password, setPassword] = useState('');
    const callbackUrl = searchParams.get('callbackUrl') || '/';
    const errorExists = searchParams.get('error');

    useEffect(() => {
        // Reset the states when isCustomer prop changes
        setEmailOrPhone('');
        setPassword('');
        setError('');  // Optionally clear the error as well
    }, [isCustomer]);

    if (errorExists) {
        if (errorExists === 'OAuthAccountNotLinked') {
            setError("Account is already linked with another provider.");
        } else if (errorExists === "CredentialsSignin") {
            setError("Invalid email or password.");
        } else {
            setError("An error occurred. Please try again later.");
        }
    }

    const handleSocialLogin = async (provider: string) => {
        await signIn(provider, { callbackUrl: callbackUrl });
    }

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const status = await signIn('credentials', { email: emailOrPhone, password: password, callbackUrl: callbackUrl, redirect: false, role: isCustomer ? 'C' : 'N' });
        if (status?.error) {
            if (status.error === "CredentialsSignin") {
                setError("Invalid email or password.");
                return;
            }
            setError(status.error);
            return;
        } else {
            const session = await getSession();
            router.refresh();
            if (session?.user?.role === 'M') {
                router.push('/admin');
            } else if (session?.user?.role === 'E') {
                router.push('/employee');
            } else if (session?.user?.role === 'S') {
                router.push('/support');
            } else {
                router.push(callbackUrl);
            }
        }
    }

    return (
        <div className="space-y-4 ">
            {/* <p className='text-center text-4xl font-bold'>{isCustomer ? "Customer Login" : "Non-Customer Login"}</p> */}

            {/* Error Display */}
            {error && (
                <Alert variant="filled" color="red" withCloseButton icon={<ExclamationCircleIcon />}
                    onClose={() => { setError('') }}>
                    {error}
                </Alert>
            )}

            {/* Login Form */}
            <form onSubmit={handleEmailLogin} className="space-y-2">
                <input
                    type="text"
                    placeholder="Email or Phone Number"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    className={fieldCSS}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={fieldCSS}
                    required
                />
                <button type="submit" className={`${buttonCSS} bg-black hover:bg-gray-700 focus:ring-gray-500`}>Login with Email</button>
            </form>

            {isCustomer && (
                <>
                    <p className='text-center text'>Forgot password? Reset <Link href={'resetpw'} className='text-blue-600 underline'>here</Link>.
                    </p>
                    <Divider my="sm" label="or connect with" labelPosition="center" />
                    <div className="grid card rounded-box place-items-center">
                        <button onClick={() => handleSocialLogin('google')} className={`${buttonCSS} bg-[#4285F4] hover:bg-[#2c0fab] focus:ring-[#2c0fab]`}>
                            <span>Login with Google</span>
                        </button>
                        <button onClick={() => handleSocialLogin('facebook')} className={`${buttonCSS} bg-[#3b5998] hover:bg-[#2d4373] focus:ring-[#2d4373]`}>
                            <span>Login with Facebook</span>
                        </button>
                        <p className='text-center text'>Need an account? Register <Link href={'register'} className='text-blue-600 underline'>here</Link>!
                        </p>
                        <div className={`${error ? 'h-4' : 'h-0'}`}></div>
                    </div>
                </>
            )}
        </div>

    );
}


export default function Page() {
    const [isCustomer, setIsCustomer] = useState(true); // Default to customer
    const [error, setError] = useState('');  // Lifting error state up to the LoginPage component

    // Reset error when switching login type
    const handleSwitchLoginType = (customer: boolean) => {
        setError('');
        setIsCustomer(customer);
    }
    return (
        <div className="flex flex-col justify-center items-center mt-12 ">
            <div className="mb-4 flex items-center space-x-2">
                <span className="font-medium text-gray-600">Login as:</span>
                <div className="relative border rounded-md overflow-hidden ">
                    <button
                        onClick={() => handleSwitchLoginType(true)}
                        className={`inset-y-0 left-0 focus:outline-none px-4 py-1 ${isCustomer ? 'bg-black text-white' : 'text-gray-600'}`}
                    >
                        Customer
                    </button>
                    <button
                        onClick={() => handleSwitchLoginType(false)}
                        className={`inset-y-0 right-0 focus:outline-none px-4 py-1 ${!isCustomer ? 'bg-black text-white' : 'text-gray-600'}`}
                    >
                        Non-Customer
                    </button>
                </div>
            </div>
            <div className="w-96 px-10 py-10 rounded-md shadow-xl bg-white border-gray-500 border">
                <UniversalLogin isCustomer={isCustomer} error={error} setError={setError} />
            </div>
        </div>
    );
}