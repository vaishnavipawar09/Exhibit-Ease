'use client';

import { Museum } from '@prisma/client';
import React, { FC, useEffect, useState } from 'react';
import { MuseumCard } from '../components/MuseumSection';
import { useMuseums } from '../contexts/MuseumContext';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Accordion, Checkbox, Group, Input, Stack } from '@mantine/core';
import { useRouter } from 'next/router';
import { useSearchParams } from 'next/navigation';

export default function Page() {
  const { museums, cities, states } = useMuseums();
  const types = ['ART', 'HISTORY', 'SCIENCE']

  // const router = useRouter();
  const searchParams = useSearchParams();
  const filterTypesQuery = searchParams.get('types')
  const filterCitiesQuery = searchParams.get('cities')
  const filterStatesQuery = searchParams.get('states')
  const filerPriceQuery = searchParams.get('price')


  const filterTypes = filterTypesQuery ? filterTypesQuery.split('|') : []
  const filterCities = filterCitiesQuery ? filterCitiesQuery.split('|') : []
  const filterStates = filterStatesQuery ? filterStatesQuery.split('|') : []
  const filterPrice = filerPriceQuery ? filerPriceQuery.split('|') : []

  console.log(filterTypes)
  return <>
    {/*Search bar */}
    {/* <div className=" py-4">
      <Input size="md" placeholder="Search anything..." leftSection={<MagnifyingGlassIcon className="h-6" color='black' />}
        styles={{
          input: { borderColor: 'black' }
        }}
        radius={8}
      />
    </div> */}

    <div className="flex flex-col w-full lg:flex-row py-4">
      <div className="grid flex-grow h-full card rounded-box lg:flex-shrink-0 lg:w-1/5">
        <Accordion defaultValue="Apples">
          <CreateFields fieldTitle='Types' setOfStrings={types} selectedValues={filterTypes} filterFunction={filterMuseums} />
          <CreateFields fieldTitle='Cities' setOfStrings={cities} selectedValues={filterCities} filterFunction={filterMuseums} />
          <CreateFields fieldTitle='States' setOfStrings={states} selectedValues={filterStates} filterFunction={filterMuseums} />
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

function CreateFields({ setOfStrings, fieldTitle, selectedValues, filterFunction }:
  { setOfStrings?: string[], fieldTitle: string, selectedValues?: string[], filterFunction: Function }) {
  var needRangeSlider = fieldTitle === 'Price';
  return <>
    <Accordion.Item key={fieldTitle} value={fieldTitle}>
      <Accordion.Control>{fieldTitle}</Accordion.Control>
      <Accordion.Panel>
        {needRangeSlider ? <p>RangeSlider</p> :
          <Checkbox.Group
            defaultValue={selectedValues}
          >
            <Stack mt="xs" align="flex-start">
              {setOfStrings ? (setOfStrings.map((str: string, index: number) => (
                <Checkbox key={index} value={str.toLowerCase()} label={str} color="black"
                  onChange={(event) => updateQueryStrings({ title: fieldTitle, value: str })} />
              ))) : <></>}
            </Stack>
          </Checkbox.Group>
        }
      </Accordion.Panel>
    </Accordion.Item>

  </>;
}

function updateQueryStrings({ title, value }: { title: string, value: string }) {
  const router = useRouter();
  router.query.title = value;
  router.push(router)
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