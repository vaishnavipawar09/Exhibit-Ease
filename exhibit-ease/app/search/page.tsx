'use client';

import { Museum } from '@prisma/client';
import Image from "next/image";
import Link from 'next/link';
import React, { FC, useEffect, useState } from 'react';
import { MuseumCard } from '../components/MuseumSection';
import { useMuseums } from '../contexts/MuseumContext';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function Page() {
  const { museums, cities, states } = useMuseums();
  const types = ['ART', 'HISTORY', 'SCIENCE']
  return <>
    {/*Search bar */}
    <div className="flex relative py-4 rounded-full items-center">
      <MagnifyingGlassIcon className="w-4 h-4 absolute left-4" />
      <input
        type="text"
        placeholder="Search Cities..."
        className="flex-grow rounded-none pl-10 py-2 outline-none border"
        onChange={() => { }}
      />
    </div>

    {/* Left side filters and right side cards */}
    <div className="flex flex-col w-full lg:flex-row">
      <div className="grid flex-grow h-full card rounded-box place-items-center lg:flex-shrink-0 lg:w-1/5">
        <CreateFields fieldTitle='Type' setOfStrings={types} filterFunction={filterMuseums} />
        <CreateFields fieldTitle='City' setOfStrings={cities} filterFunction={filterMuseums} />
        <CreateFields fieldTitle='State' setOfStrings={states} filterFunction={filterMuseums} />
        <CreateFields fieldTitle='Price' filterFunction={filterMuseums} />
      </div>


      <div className="divider lg:divider-horizontal"></div>
      <div className="flex-grow h-full card rounded-box place-items-center lg:w-4/5">
        <div className="grid grid-cols-3 gap-4 w-full">
          {museums && museums.map(
            (museum, index) => (
              <MuseumCard key={index} index={index} museum={museum} />
            )
          )}
        </div>
      </div>
    </div>

  </>
}

function CreateFields({ setOfStrings, fieldTitle, filterFunction }:
  { setOfStrings?: Array<string>, fieldTitle: string, filterFunction: Function }) {
  return <>
    <div className="collapse collapse-plus">
      <input type="radio" name="my-accordion-3" onChange={() => { }} />
      <div className="collapse-title text-xl font-medium">
        {fieldTitle}
      </div>
      <div className="collapse-content">
        {setOfStrings ? (setOfStrings.map((str: string, index: number) => (

          <div key={index} className="form-control">
            <label className="label cursor-pointer">
              <input name={fieldTitle.toLowerCase()} value={str} type="checkbox" defaultChecked={false} className="checkbox" onChange={() => { }} />
              <span className={str}>{str}</span>
            </label>
          </div>
        ))) : <input type="range" min={0} max="100" value="40" className="range range-xs" onChange={() => { }} />}
      </div>
    </div></>
}

function filterMuseums({ museumList }: { museumList: Museum[] }) {
  var selectedTypes;
  var selectedCities;
  var selectedStates;

  useEffect(() => {
    selectedTypes = document.querySelectorAll("input[name='type']:checked");
    console.log(selectedTypes);
  }, [museumList]);
}