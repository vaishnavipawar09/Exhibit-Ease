'use client'

import React from 'react';
import Link from 'next/link';
import CityPopUp from './components/CityPopUp';
import { MuseumSection } from './components/MuseumSection';

export default function Page() {

  return <main className="h-screen">

    <CityPopUp />

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

    <MuseumSection query={{ title: 'Art Museums', type: 'ART' }} />
    <MuseumSection query={{ title: 'Science Museums', type: 'SCIENCE' }} />
    <MuseumSection query={{ title: 'History Museums', type: 'HISTORY' }} />

  </main>
}