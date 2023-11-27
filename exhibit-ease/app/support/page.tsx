'use client';

import Chat from "../components/Chat";
import { useRoleRedirect } from "../components/useRoleRedirect";

export default function Page() {
    useRoleRedirect();
    return <Chat data={[]} />;
}