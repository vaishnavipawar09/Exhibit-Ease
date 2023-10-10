import { prisma } from '@/lib/prisma';
import Image from "next/image";

export default async function Page({ params }: {
  params: { id: string }
}) {
  const museum = await prisma.museum.findFirst({
    where: {
      id: parseInt(params.id)
    }
  })

  return <main className="h-screen">
    {/* Top section */}
    <div className="relative pt-20 pb-10 px-5 md:px-20 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "linear-gradient(rgba(255, 255, 255, .4), rgba(255, 255, 255, .4)), url('https://travel.usnews.com/images/NaturalHistoryMuseum_013_301047_20220629.jpg')" }}>
      <div className="container mx-auto flex justify-between items-center h-full relative">
        {/* Museum image */}
        <div className="w-1/2 flex items-center">
          {museum && (
            <Image
              src={"https://drive.google.com/uc?export=view&id=" + museum.main_image || ""}
              alt={museum.name}
              width={350}
              height={350}
              className="rounded-xl shadow-lg"
            />
          )}
        </div>

        {/* Museum text */}
        <div className="w-1/2 text-right pr-10 flex items-center">
          <div>
            <h1 className="text-4xl font-bold mb-4 text-center">{museum?.name}</h1>
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