import { prisma } from '@/lib/prisma';
import getMuseums from './Museums';
import Image from "next/image";

export default async function BookingMuseumData({ museumID }: {
    museumID: number
}) {
    const museum = await getMuseums()
    const currMuseum = museum.find(museum => museum.id === museumID)

    return <div className="hero h-3/4"
        style={{ backgroundImage: `linear-gradient(rgba(255, 255, 255, .6), rgba(255, 255, 255, .6)), url('${currMuseum?.bg_image}')` }}>

        <div className="hero-content flex-col lg:flex-row">
            {currMuseum && (
                <Image
                    src={currMuseum.main_image || ""}
                    alt={currMuseum.name}
                    width={100}
                    height={100}
                    className="w-[100px] h-[100px] rounded-xl border-black border-[3px] max-w-sm shadow-2xl"
                />
            )}
            <div className='mx-auto text-center'>
                <h1 className="text-6xl font-bold mb-4 text-center">{currMuseum?.name}</h1>
                <div className="flex flex-col items-center"></div>
            </div>
        </div>
    </div>
}
