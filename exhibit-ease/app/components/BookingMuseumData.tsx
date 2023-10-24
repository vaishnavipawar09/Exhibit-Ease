import { prisma } from '@/lib/prisma';

export default async function BookingMuseumData({ museumID }: {
    museumID: number
}) {
    const museum = await prisma.museum.findFirst({
        where: {
            id: museumID
        }
    })

    return <p>This is museum {museum?.name}</p>
}