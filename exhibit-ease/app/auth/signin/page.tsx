// 'use client'

// import { useState } from 'react';
// import { signIn } from "next-auth/react";
// import { useSearchParams } from 'next/navigation';
// import { useRouter } from 'next/navigation'
// import Link from 'next/link';

// var fieldCSS: string = "border-black border w-full px-3 py-2 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:shadow-outline-gray focus:border-gray-300"
// var buttonCSS: string = "w-full py-2 px-4 mb-3 flex items-center justify-center space-x-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2"


// export function LoginTabs() {
//     const [activeTab, setActiveTab] = useState('customer');

//     return (
//         <div className="flex flex-col justify-center items-center">
//             <div className='w-1/2 mt-12 px-10 py-10 rounded-t-md shadow-xl bg-white'>
//                 <div className="tabs tabs-boxed rounded">
//                     {['customer', 'non-customer'].map((tab, index) => (
//                         <button key={index}
//                             className={`tab tab-lg flex-auto ${activeTab == tab ? 'tab-active' : ''}`}
//                             onClick={() => setActiveTab(tab)}
//                         >
//                             {tab == 'customer' ? 'Customer' : 'Non-Customer'}
//                         </button>
//                     ))}
//                 </div>
//             </div>
//             <div className="relative w-1/2 pb-16 pt-8 bg-white px-10 rounded-b-md shadow-xl flex justify-center items-center h-[450px]">
//                 <div className={`transition-opacity duration-500 absolute ${activeTab === 'customer' ? 'opacity-1' : 'opacity-0'} ${activeTab !== 'customer' ? 'pointer-events-none' : ''}`}>
//                     <UniversalLogin />
//                 </div>
//                 <div className={`transition-opacity duration-500 absolute ${activeTab === 'non-customer' ? 'opacity-1' : 'opacity-0'} ${activeTab !== 'non-customer' ? 'pointer-events-none' : ''}`}>
//                     <UniversalLogin isCustomer={false} />
//                 </div>
//             </div>
//         </div>
//     );
// }


// export function UniversalLogin({ isCustomer = true }) {
//     const router = useRouter();
//     const searchParams = useSearchParams();
//     const [emailOrPhone, setEmailOrPhone] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState('');
//     const callbackUrl = searchParams.get('callbackUrl') || '/';
//     const errorExists = searchParams.get('error');

//     if (errorExists) {
//         if (errorExists === 'OAuthAccountNotLinked') {
//             setError("Account is already linked with another provider.");
//         } else if (errorExists === "CredentialsSignin") {
//             setError("Invalid email or password.");
//         } else {
//             setError("An error occurred. Please try again later.");
//         }
//     }

//     const handleSocialLogin = async (provider: string) => {
//         await signIn(provider, { callbackUrl: callbackUrl });
//     }

//     const handleEmailLogin = async (e: React.FormEvent) => {
//         e.preventDefault();
//         const status = await signIn('credentials', { email: emailOrPhone, password: password, callbackUrl: callbackUrl, redirect: false, role: isCustomer ? 'C' : 'N' });
//         if (status?.error) {
//             if (status.error === "CredentialsSignin") {
//                 setError("Invalid email or password.");
//                 return;
//             }
//             setError(status.error);
//             return;
//         }
//         router.push("/");
//     }

//     return (
//         <div className="space-y-4">
//             <p className='text-center text-4xl font-bold'>Login</p>
//             {error &&
//                 <div className="alert p-2  alert-error bg-red-600">
//                     <svg xmlns="http://www.w3.org/2000/svg"
//                         className="stroke-current shrink-0 h-6 w-6"
//                         fill="none"
//                         viewBox="0 0 24 24">
//                         <path strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth="2"
//                             d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//                     </svg>
//                     <span>{error}</span>
//                 </div>
//             }
//             <form onSubmit={handleEmailLogin} className="space-y-2">
//                 <input type="text" placeholder="Email or Phone Number" value={emailOrPhone} onChange={(e) => setEmailOrPhone(e.target.value)} className={fieldCSS} required />
//                 <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className={fieldCSS} required />
//                 <button type="submit" className={`${buttonCSS} bg-gray-800 hover:bg-gray-700 focus:ring-gray-500`}>Login with Email</button>
//             </form>
//             {isCustomer &&
//                 <>
//                     <div className="divider">or connect with</div>
//                     <div className="grid card rounded-box place-items-center">
//                         <button onClick={() => handleSocialLogin('google')} className={`${buttonCSS} bg-[#4285F4] hover:bg-[#2c0fab] focus:ring-[#2c0fab]`}><span>Login with Google</span></button>
//                         <button onClick={() => handleSocialLogin('facebook')} className={`${buttonCSS} bg-[#3b5998] hover:bg-[#2d4373] focus:ring-[#2d4373]`}><span>Login with Facebook</span></button>
//                         <p className='text-center text'>Need an account? Register <Link href={'register'} className='text-blue-600 underline'>here!</Link></p>
//                         <div className={`${error ? 'h-4' : 'h-0'}`}></div>
//                     </div>

//                 </>
//             }

//         </div>
//     );
// }


// export default function LoginPage() {
//     return (
//         <div>
//             <LoginTabs />
//         </div>
//     );
// }

'use client'

import { SetStateAction, useEffect, useState } from 'react';
import { signIn } from "next-auth/react";
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation'
import Link from 'next/link';

var fieldCSS: string = "border-black border w-full px-3 py-2 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:shadow-outline-gray focus:border-gray-300"
var buttonCSS: string = "w-full py-2 px-4 mb-3 flex items-center justify-center space-x-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2"

interface UniversalLoginProps {
    isCustomer?: boolean;
    error: string;
    setError: React.Dispatch<SetStateAction<string>>;
}

export function UniversalLogin({ isCustomer = true, error, setError }: UniversalLoginProps) {
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
        }
        router.push("/");
    }

    return (
        <div className="space-y-4">
            {/* <p className='text-center text-4xl font-bold'>{isCustomer ? "Customer Login" : "Non-Customer Login"}</p> */}

            {/* Error Display */}
            {error && (
                <div className="alert p-2  alert-error bg-red-600">
                    <svg xmlns="http://www.w3.org/2000/svg"
                        className="stroke-current shrink-0 h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24">
                        <path strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>{error}</span>
                </div>
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
                <button type="submit" className={`${buttonCSS} bg-gray-800 hover:bg-gray-700 focus:ring-gray-500`}>Login with Email</button>
            </form>

            {isCustomer && (
                <>
                    <div className="divider">or connect with</div>
                    <div className="grid card rounded-box place-items-center">
                        <button onClick={() => handleSocialLogin('google')} className={`${buttonCSS} bg-[#4285F4] hover:bg-[#2c0fab] focus:ring-[#2c0fab]`}>
                            <span>Login with Google</span>
                        </button>
                        <button onClick={() => handleSocialLogin('facebook')} className={`${buttonCSS} bg-[#3b5998] hover:bg-[#2d4373] focus:ring-[#2d4373]`}>
                            <span>Login with Facebook</span>
                        </button>
                        <p className='text-center text'>Need an account? Register
                            <Link href={'register'} className='text-blue-600 underline'> here!</Link>
                        </p>
                        <div className={`${error ? 'h-4' : 'h-0'}`}></div>
                    </div>
                </>
            )}
        </div>

    );
}


export default function LoginPage() {
    const [isCustomer, setIsCustomer] = useState(true); // Default to customer
    const [error, setError] = useState('');  // Lifting error state up to the LoginPage component

    // Reset error when switching login type
    const handleSwitchLoginType = (customer: boolean) => {
        setError('');
        setIsCustomer(customer);
    }
    return (
        <div className="flex flex-col justify-center items-center mt-12">
            <div className="mb-4 flex items-center space-x-2">
                <span className="font-medium text-gray-600">Login as:</span>
                <div className="relative border rounded-md overflow-hidden">
                    <button
                        onClick={() => handleSwitchLoginType(true)}
                        className={`inset-y-0 left-0 focus:outline-none px-4 py-1 ${isCustomer ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
                    >
                        Customer
                    </button>
                    <button
                        onClick={() => handleSwitchLoginType(false)}
                        className={`inset-y-0 right-0 focus:outline-none px-4 py-1 ${!isCustomer ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
                    >
                        Non-Customer
                    </button>
                </div>
            </div>
            <div className="w-96 px-10 py-10 rounded-md shadow-xl bg-white">
                <UniversalLogin isCustomer={isCustomer} error={error} setError={setError} />
            </div>
        </div>
    );
}