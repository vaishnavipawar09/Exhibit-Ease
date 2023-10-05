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

  return <main>
    <p>Welcome to {museum?.name}</p>
    <div className="flex justify-center items-center h-screen">
      {museum && (
        <div className="relative w-full max-w-[600px]">
          <div className="w-full">
            <Image src={museum.main_image || ""} alt={museum.name} />
          </div>
          <div className="absolute w-full h-full bg-[rgba(0,0,0,0.5)] flex justify-center items-center left-0 top-0">
            <div className="text-center p-5">
              <h1>{museum.name}</h1>
              <p>About the Museum:</p>
              <p>{museum.description}</p>
              <br />
              <button className="bg-[#007bff] text-[white] text-lg cursor-pointer px-5 py-2.5 border-[none] hover:bg-[#0056b3]">Book Now</button>
            </div>
          </div>
        </div>
      )}
    </div>
  </main>
}