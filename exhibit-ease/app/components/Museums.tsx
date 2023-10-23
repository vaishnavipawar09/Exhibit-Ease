import { Museum } from "@prisma/client";

export default async function getMuseums(): Promise<Museum[]> {
    const res = await fetch('http://localhost:3000/api/museums',
        {
            next: {
                revalidate: 21600,
            }
        })
    return res.json();
}