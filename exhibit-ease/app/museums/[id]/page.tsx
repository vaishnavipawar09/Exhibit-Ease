import {prisma} from '@/lib/prisma';

export default async function Page({params}: {
    params: {id : string}
}) {
    const museum = await prisma.museum.findFirst({
        where: {
            id: parseInt(params.id)
        }
    })

    return <main>
        <p>Welcome to {museum?.name}</p>
    </main>
}