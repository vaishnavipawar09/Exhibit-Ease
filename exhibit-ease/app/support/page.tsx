'use client';

import { useSession } from "next-auth/react";
import Chat from "../components/Chat";
import { useRoleRedirect } from "../components/useRoleRedirect";
import Support from "./componenets/Support";

export default function Page() {
    useRoleRedirect();
    const { data: session } = useSession();
    if (session?.user?.role === 'C') {
        return <Chat msgs={[]} />;
    } else if (session?.user?.role == 'S') {
        return <Support />;
    }
}