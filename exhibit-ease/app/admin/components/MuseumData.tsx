import { useSession } from "next-auth/react";

export default function MuseumData() {
    const { data: session } = useSession();

    if (session) {
        return <h1>{JSON.stringify(session?.user)}</h1>
    } else {
        return <h1>Not logged in</h1>
    }
}