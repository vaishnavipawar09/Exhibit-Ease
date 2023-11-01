'use client';

import { Museum } from '@prisma/client';
import Image from "next/image";
import Link from 'next/link';
import React, { FC, useEffect, useState } from 'react';
import { MuseumCard } from '../components/MuseumSection';
import { useMuseums } from '../contexts/MuseumContext';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Accordion, Checkbox, Group, Input, Stack } from '@mantine/core';

export default function Page() {
  const { museums, cities, states } = useMuseums();
  const types = ['ART', 'HISTORY', 'SCIENCE']
  return <>
    {/*Search bar */}
    <div className=" py-4">
      <Input size="md" placeholder="Search anything..." leftSection={<MagnifyingGlassIcon className="h-6" color='black' />}
        styles={{
          input: { borderColor: 'black' }
        }}
        radius={8}
      />
    </div>

    <div className="flex flex-col w-full lg:flex-row">
      <div className="grid flex-grow h-full card rounded-box lg:flex-shrink-0 lg:w-1/5">
        <Accordion defaultValue="Apples">

          <CreateFields fieldTitle='Type' setOfStrings={types} filterFunction={filterMuseums} />
          <CreateFields fieldTitle='City' setOfStrings={cities} filterFunction={filterMuseums} />
          <CreateFields fieldTitle='State' setOfStrings={states} filterFunction={filterMuseums} />
          <CreateFields fieldTitle='Price' filterFunction={filterMuseums} />
        </Accordion>
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
  var needRangeSlider = fieldTitle === 'Price';
  return <>
    <Accordion.Item key={fieldTitle} value={fieldTitle}>
      <Accordion.Control>{fieldTitle}</Accordion.Control>
      <Accordion.Panel>
        {needRangeSlider ? <p>RangeSlider</p> :
          <Checkbox.Group
            defaultValue={[]}

          >
            <Stack mt="xs" align="flex-start">
              {setOfStrings ? (setOfStrings.map((str: string, index: number) => (
                <Checkbox key={index} value={str} label={str} color="black" />
              ))) : <></>}
            </Stack>
          </Checkbox.Group>
        }
      </Accordion.Panel>
    </Accordion.Item>

  </>;
}
// {setOfStrings ? (setOfStrings.map((str: string, index: number) => (
//   <Checkbox.Group
//   defaultValue={[]}
//   label={fieldTitle}
//   value={[fieldTitle]}
// >
//   <Stack mt="xs" align="flex-start">
//     <Checkbox value="react" label="React" />
//   </Stack>
// </Checkbox.Group>
// ))): <p>Range Slider</p> 
{/* <>
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
    </div></> */}

function filterMuseums({ museumList }: { museumList: Museum[] }) {
  var selectedTypes;
  var selectedCities;
  var selectedStates;

  useEffect(() => {
    selectedTypes = document.querySelectorAll("input[name='type']:checked");
    console.log(selectedTypes);
  }, [museumList]);
}