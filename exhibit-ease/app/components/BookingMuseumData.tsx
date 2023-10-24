import { prisma } from '@/lib/prisma';
import getMuseums from './Museums';

export default async function BookingMuseumData({ museumID }: {
    museumID: number
}) {
    const museum = await getMuseums()
    const currMuseum = museum.find(museum => museum.id === museumID)

    return <p>This is museum {currMuseum?.name}</p>
}
