'use client'

import { prisma } from '@/lib/prisma';
import Image from "next/image";
import React from 'react';
import { Museum } from '@prisma/client'
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Page() {

  return <main className="h-screen">
    {/* Top section */}
    <div className="flex flex-col justify-center items-center h-[70%] px-5 md:px-20 bg-cover bg-center bg-no-repeat shadow-[inset_0_-2px_4px_rgba(0,0,0,0.1)]"
      style={{ backgroundImage: `linear-gradient(rgba(255, 255, 255, .4), rgba(255, 255, 255, .4)), url(https://cdn.sanity.io/images/cctd4ker/production/909fa245367580e643fff7bedf1f5ca129443163-1200x630.jpg?w=600&q=75&auto=format)` }}>

      <div className="text-center mb-10 md:mb-20">
        <h1 className="text-8xl font-bold">
          Exhibit Ease
        </h1>
        <h4 className="pt-5 text-xl font-semibold">
          One stop shop for all your museum needs
        </h4>
      </div>

      <Link href={"/search/"} className="w-full text-center">
        <button className="btn btn-primary bg-[#661900]">Search Museums</button>
      </Link>

    </div>

    <hr className="h-px my-8 border-0 bg-white" />

    <MuseumSection query="type=ART&take=3" />
    <MuseumSection query="type=HISTORY&take=3" />
    <MuseumSection query="type=SCIENCE&take=3" />

  </main>
}

export const MuseumSection = ({ query }: { query: string }) => {
  const [museums, setMuseums] = useState<Museum[]>([]);

  useEffect(() => {
    const fetchMuseums = async () => {
      const response = await fetch(`/api/museums?${query}`);
      const data = await response.json();
      setMuseums(data);
    };

    fetchMuseums();
  }, [query]);

  return (
    <div className='bg-gray-200 mb-5 h-5/6 shadow-inner rounded-sm'>
      <p className='pt-5 pl-2 text-3xl font-semibold'>New York</p>
      <div className='divider divider-vertical my-[8px] pl-2 pr-2 before:bg-gray-500 after:bg-gray-500'></div>
      <div className="flex w-full h-5/6 p-2">
        {museums.map((museum, index) => (
          <div key={index} className="flex w-full p-2">
            <div className="card rounded-md w-full bg-base-100 shadow-lg flex flex-col justify-between">
              <figure className='h-1/2'>
                <Image
                  src={museum.main_image || ''}
                  alt={museum.name}
                  width={300}
                  height={100}
                  objectFit="cover"
                />
              </figure>
              <div className="card-body flex flex-col justify-between">
                <div>
                  {/* Set a fixed height for the card title */}
                  <h2 className="card-title line-clamp h-[3rem] mb-[1rem]">{museum.name}</h2>
                  {/* Set a fixed height for the address */}
                  <Link href={"https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(museum?.address || '') + '+' + encodeURIComponent(museum?.city || '') + '+' + encodeURIComponent(museum?.state || '')}
                    rel="noopener noreferrer" target="_blank"
                    className='mb-[.5rem] h-[2rem] block'>
                    {museum?.city}, {museum?.state}
                  </Link>
                </div>
                <div className="card-actions justify-evenly">
                  <Link href={"/museums/" + museum.id} className="w-full">
                    <button className="btn btn-primary w-full bg-[#661900]">View Museum</button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
