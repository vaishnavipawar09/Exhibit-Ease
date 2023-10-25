'use client';

import { Museum } from '@prisma/client';
import Image from "next/image";
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { MuseumCard } from '../components/MuseumSection';
import { useMuseums } from '../contexts/MuseumContext';

export default function Page() {
  const { museums, cities, states } = useMuseums();
  return <>
    {/*Search bar */}
    <div className="w-full px-10 mb-10">
      <div className="flex bg-white p-4 rounded-full items-center shadow-xl">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search Museums..."
          className="flex-grow rounded-full px-4 py-2 outline-none"
        />
        {/* Search Button */}
        <button className="bg-blue-500 text-white rounded-full px-4 py-2">Search</button>
      </div>
    </div>
    {/* Left side filters and right side cards */}
    <div className="flex flex-col w-full lg:flex-row">
      <div className="grid flex-grow h-full card bg-base-300 rounded-box place-items-center lg:flex-shrink-0 lg:w-1/5">
        {/* Museum Type Filter */}
        <div className="collapse collapse-plus bg-base-200">
          <input type="radio" name="my-accordion-3" defaultChecked={true} />
          <div className="collapse-title text-xl font-medium">
            Type
          </div>
          <div className="collapse-content">
            <div className="form-control">
              <label className="label cursor-pointer">
                <input type="checkbox" defaultChecked={false} className="checkbox" />
                <span className="ART">ART</span>
              </label>
            </div>
            <div className="form-control">
              <label className="label cursor-pointer">
                <input type="checkbox" defaultChecked={false} className="checkbox" />
                <span className="SCIENCE">SCIENCE</span>
              </label>
            </div>
            <div className="form-control">
              <label className="label cursor-pointer">
                <input type="checkbox" defaultChecked={false} className="checkbox" />
                <span className="label-text">HISTORY</span>
              </label>
            </div>
          </div>
        </div>
        {/* Museum City Filter */}
        <div className="collapse collapse-plus bg-base-200">
          <input type="radio" name="my-accordion-3" />
          <div className="collapse-title text-xl font-medium">
            City
          </div>
          <div className="collapse-content">
            <CreateCheckboxes setOfStrings={Array.from(cities)} />
          </div>
        </div>
        {/* Museum State Filter */}
        <div className="collapse collapse-plus bg-base-200">
          <input type="radio" name="my-accordion-3" />
          <div className="collapse-title text-xl font-medium">
            State
          </div>
          <div className="collapse-content">
            <CreateCheckboxes setOfStrings={Array.from(states)} />
          </div>
        </div>
        {/* Museum Price Filter */}
        <div className="collapse collapse-plus bg-base-200">
          <input type="radio" name="my-accordion-3" />
          <div className="collapse-title text-xl font-medium">
            Price
          </div>
          <div className="collapse-content">
            <input type="range" min={0} max="100" value="40" className="range range-xs" />
          </div>
        </div>
      </div>
      <div className="divider lg:divider-horizontal"></div>
      <div className="flex-grow h-full card bg-base-300 rounded-box place-items-center lg:w-4/5">
        <div className="grid grid-cols-3 gap-4">
          {museums && museums.map(
            (museum, index) => (
              <MuseumCard index={index} museum={museum} />
            )
          )}
        </div>
      </div>
    </div>

  </>
}

function CreateCheckboxes({ setOfStrings }: { setOfStrings: Array<string> }) {
  return <>{setOfStrings.map((str: string, index: number) => (
    <div key={index} className="form-control">
      <label className="label cursor-pointer">
        <input type="checkbox" defaultChecked={false} className="checkbox" />
        <span className={str}>{str}</span>
      </label>
    </div>
  ))}</>
}
