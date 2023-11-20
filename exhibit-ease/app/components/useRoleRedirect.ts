import { useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

export const useRoleRedirect = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const searchparams = useSearchParams();

    useEffect(() => {
        // Handle the case where there is no session (user is not logged in)
        if (!session) {
            const callbackUrl = encodeURIComponent(pathname);

            if (pathname.startsWith('/booking')) {
                const id = searchparams.get('id');
                router.push(`/auth/signin?callbackUrl=${callbackUrl}?id=${id}`);
                return;
            }

            // Redirect to login with the callback URL
            router.push(`/auth/signin?callbackUrl=${callbackUrl}`);

            return;
        }

        // If there is a session, proceed with role-based redirection
        const role = session.user?.role;
        if (pathname.startsWith('/admin') && role !== 'M') {
            router.push(`/not-found?message=${encodeURIComponent("Admin access only.")}`);
        } else if (pathname.startsWith('/employee') && role !== 'E') {
            router.push(`/not-found?message=${encodeURIComponent("Employee access only.")}`);
        } else if (pathname.startsWith('/booking') && role !== 'C') {
            router.push(`/not-found?message=${encodeURIComponent("Customer access only.")}`);
        } else if (pathname.startsWith('/support') && role !== 'C' && role !== 'S') {
            router.push(`/not-found?message=${encodeURIComponent("Customer and Support access only.")}`);
        }
    }, [session, pathname]);
};
