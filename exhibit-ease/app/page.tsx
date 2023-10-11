'use client'

import { prisma } from '@/lib/prisma';
import Image from "next/image";
import React from 'react';
import { Museum } from '@prisma/client'

export default function Page() {

  return <main className="h-screen">
    {/* Top section */}
    <div className="flex flex-col justify-center items-center h-[70%] px-5 md:px-20 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `linear-gradient(rgba(255, 255, 255, .4), rgba(255, 255, 255, .4)), url(https://cdn.sanity.io/images/cctd4ker/production/909fa245367580e643fff7bedf1f5ca129443163-1200x630.jpg?w=600&q=75&auto=format)` }}>

      <div className="text-center mb-10 md:mb-20">
        <h1 className="text-8xl font-bold">
          Exhibit Ease
        </h1>
        <h4 className="pt-5 text-xl font-semibold">
          One stop shop for all your museum needs
        </h4>
      </div>

      <div className="w-full max-w-md">
        <div className="flex bg-white p-4 rounded-full items-center shadow-lg">
          <input
            type="text"
            placeholder="Search Museums..."
            className="flex-grow rounded-full px-4 py-2 outline-none"
          />
          {/* <button className="ml-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>

          </button> */}
        </div>
      </div>

    </div>

    <hr className="h-px my-8 border-0 bg-white" />

    <MuseumSection query={{ type: 'ART' }} />
    <MuseumSection query={{ type: 'HISTORY' }} />
    <MuseumSection query={{ type: 'SCIENCE' }} />

  </main>
}

async function fetchMuseumData(query: Record<string, any>): Promise<Museum[]> {
  const museum = await prisma.museum.findMany({
    where: query
  });
  return museum;
}

function MuseumCard({ museum }: { museum: Museum }) {
  return (
    <div className="card card-compact rounded-md w-auto bg-base-100 shadow-lg">
      <figure>
        <Image src={museum.main_image || ''} alt={museum.name} />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{museum.name}</h2>
        <p>{museum.address}</p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary">Buy Now</button>
        </div>
      </div>
    </div>
  );
}

async function MuseumSection({ query }: { query: Record<string, any> }) {

  const [data, setData] = React.useState<Museum[]>([]);

  React.useEffect(() => {
    async function fetchData() {
      const result = await fetchMuseumData(query);
      setData(result);
    }
    fetchData();
  }, [query]);


  return (<div className='bg-gray-50 mb-5 shadow-inner rounded-md'>
    <p className='pt-5 pl-2 text-3xl font-semibold'>New York</p>
    <div className='divider divider-vertical my-[8px] pl-2 pr-2 before:bg-gray-500 after:bg-gray-500'></div>
    <div className="flex w-full p-2">
      <div className="flex w-full p-2">
        {data.map(item => (
          <React.Fragment key={item.name}>
            <MuseumCard museum={item} />
            <div className="divider mx-[8px] divider-horizontal before:bg-transparent after:bg-transparent"></div>
          </React.Fragment>
        ))}
      </div>
    </div>
  </div>)
}