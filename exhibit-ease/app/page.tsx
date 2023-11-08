'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import CityPopUp from './components/CityPopUp';
import { MuseumSection } from './components/MuseumSection';
import { Button, Text } from '@mantine/core';

export default function Page() {
  const [chosenCity, setChosenCity] = useState<string | null>(null);

  useEffect(() => {
    // Retrieve 'choosenCity' from localStorage
    const storedCity = localStorage.getItem('choosenCity');

    // If 'choosenCity' exists, set it to the state
    if (storedCity) {
      setChosenCity(storedCity);
    }
  }, []);

  return <main className="h-screen ">
    {/* Top section */}
    <div className="flex flex-col rounded-sm justify-center items-center h-[70%] px-5 md:px-20 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `linear-gradient(rgba(255, 255, 255, .55), rgba(255, 255, 255, .55)), url(https://cdn.sanity.io/images/cctd4ker/production/909fa245367580e643fff7bedf1f5ca129443163-1200x630.jpg?w=600&q=75&auto=format)` }}>

      <div className="text-center mb-10">
        <Text size='6rem' style={{ fontWeight: 'bold' }}>
          Exhibit Ease
        </Text>
        <Text size='1.25rem' style={{ fontWeight: 'bold', paddingTop: '1.25rem' }}>
          One stop shop for all your museum needs
        </Text>
      </div>

      <Button variant="filled" size="md" color="rgba(166, 0, 0, 1)" component={Link} href='/search'>Search Museums</Button>

    </div>

    <hr className="h-px my-4 border-0" />


    {chosenCity && (
      <MuseumSection query={{ title: `${chosenCity} Museums`, city: chosenCity }} />
    )}

    <MuseumSection query={{ title: 'Popular Art Museums', type: 'ART' }} />
    <MuseumSection query={{ title: 'Popular Science Museums', type: 'SCIENCE' }} />
    <MuseumSection query={{ title: 'Popular History Museums', type: 'HISTORY' }} />
    <div className="pb-5"></div>
  </main>
}