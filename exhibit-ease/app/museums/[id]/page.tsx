import { prisma } from '@/lib/prisma';
import Image from "next/image";
import Link from 'next/link';

export default async function Page({ params }: {
  params: { id: string }
}) {
  const museum = await prisma.museum.findFirst({
    where: {
      id: parseInt(params.id)
    }
  })

  const googleMapsLink: string = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(museum?.address || '') + '+' + encodeURIComponent(museum?.city || '') + '+' + encodeURIComponent(museum?.state || '')

  return <main className="h-screen">
    {/* Top section */}
    <div className="relative pt-20 pb-10 px-5 md:px-20 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `linear-gradient(rgba(255, 255, 255, .6), rgba(255, 255, 255, .6)), url('${museum?.bg_image}')` }}>
      <div className="container mx-auto flex justify-between items-center h-full relative">
        {/* Museum image */}
        <div className="flex items-center">
          {museum && (
            <Image
              src={museum.main_image || ""}
              alt={museum.name}
              width={350}
              height={350}
              className="w-[350px] h-[350px] rounded-xl border-black border-[3px]"
            />
          )}
        </div>

        {/* Museum text */}
        <div className="w-1/2 text-center pr-10 flex items-center">
          <div>
            <h1 className="text-6xl font-bold mb-4 text-center">{museum?.name}</h1>
            <Link href={googleMapsLink}
              rel="noopener noreferrer" target="_blank"
              className="text-4xl font-semibold mb-4 text-center">
              {museum?.address}, {museum?.city}, {museum?.state}
            </Link>
          </div>
        </div>
      </div>
    </div>

    {/* About section */}
    <div className="container mx-auto px-5 md:px-20 py-10">
      <p className="text-lg font-bold mb-4">About the Museum:</p>
      {museum && (
        <div className="mb-10">
          {museum?.description?.split('\\n').map((line, index) => (
            <p key={index} className="text-xl mb-4">
              {line}
            </p>
          ))}
        </div>
      )}

      <hr className="h-px my-8 bg-gray-200 border-0 bg-black" />

      <div className="text-center">
        <button className="bg-blue-600 text-white text-lg cursor-pointer px-5 py-2.5 border-none hover:bg-blue-700">
          Book Now
        </button>
      </div>
    </div>
  </main>
}