'use client';

import { Museum } from '@prisma/client';
import React, { FC, useEffect, useState } from 'react';
import { MuseumCard } from '../components/MuseumSection';
import { useMuseums } from '../contexts/MuseumContext';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Accordion, ActionIcon, Center, Checkbox, Grid, Group, Input, NumberInput, SimpleGrid, Stack } from '@mantine/core';
import { useRouter } from 'next/router';
import { useQueryState } from 'next-usequerystate'
import { ClearAll } from 'tabler-icons-react';

export default function Page() {
  const { museums: allMuseums, cities, states, prices } = useMuseums();
  const types = ['ART', 'HISTORY', 'SCIENCE']

  const [typesQS, setTypes] = useQueryState('types')
  const [citiesQS, setCities] = useQueryState('cities')
  const [statesQS, setStates] = useQueryState('states')
  const [priceQS, setPrice] = useQueryState('price')

  const filterTypes = typesQS ? typesQS.split('|') : []
  const filterCities = citiesQS ? citiesQS.split('|') : []
  const filterStates = statesQS ? statesQS.split('|') : []
  const filterPrice = priceQS ? priceQS.split('|') : ['', '']

  const defaultAccordionValues = [];

  if (filterTypes.length > 0) defaultAccordionValues.push('Types');
  if (filterCities.length > 0) defaultAccordionValues.push('Cities');
  if (filterStates.length > 0) defaultAccordionValues.push('States');
  if (filterPrice.length > 0 && (filterPrice[0] !== '' || filterPrice[1] !== '')) defaultAccordionValues.push('Price');
  const [filteredMuseums, setFilteredMuseums] = useState(allMuseums);

  useEffect(() => {
    setFilteredMuseums(filterMuseums(allMuseums, filterTypes, filterCities, filterStates, filterPrice));
  }, [allMuseums, typesQS, citiesQS, statesQS, priceQS]);

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
        <Accordion multiple={true} defaultValue={defaultAccordionValues}>
          <CreateFields fieldTitle='Types' setOfStrings={types} selectedValues={filterTypes} filterFunction={setTypes} />
          <CreateFields fieldTitle='Cities' setOfStrings={cities} selectedValues={filterCities} filterFunction={setCities} />
          <CreateFields fieldTitle='States' setOfStrings={states} selectedValues={filterStates} filterFunction={setStates} />
          <CreateFields fieldTitle='Price' filterFunction={setPrice} selectedValues={filterPrice} />
        </Accordion>
      </div>

      <div className="divider lg:divider-horizontal"></div>
      <div className="flex-grow h-full card rounded-box place-items-center lg:w-4/5">
        <SimpleGrid cols={3}>
          {filteredMuseums.map((museum, index) => (
            <div key={museum.id}>
              <MuseumCard index={index} museum={museum} />
            </div>
          ))}
        </SimpleGrid>
      </div>
    </div>

  </>
}

function CreateFields({ setOfStrings, fieldTitle, selectedValues, filterFunction }:
  { setOfStrings?: string[], fieldTitle: string, selectedValues: string[], filterFunction: Function }) {
  var needRangeSlider = fieldTitle === 'Price';
  return <>
    <Accordion.Item key={fieldTitle} value={fieldTitle}>
      <Accordion.Control>
        {fieldTitle}
      </Accordion.Control>

      <Accordion.Panel>
        {needRangeSlider ? <Group gap="xl" grow>
          <NumberInput
            placeholder="Min price"
            onChange={(v) => {

              if (v === '' && selectedValues[1] === '') {
                filterFunction(null)
              } else {
                filterFunction(`${v}|${selectedValues[1]}`)
              }
            }}
            min={0}
            defaultValue={selectedValues[0]}
          />
          <NumberInput
            placeholder="Max price"
            min={0}
            max={100}
            onChange={(v) => {
              if (v === '' && selectedValues[0] === '') {
                filterFunction(null)
              } else {
                filterFunction(`${selectedValues[0]}|${v}`)
              }

            }}
            defaultValue={selectedValues[1]}
          />
        </Group> :
          <Checkbox.Group
            value={selectedValues}
            onChange={(values) => {
              filterFunction(values.length > 0 ? values.join('|') : null);
            }}
          >
            <Stack mt="xs" align="flex-start">
              {setOfStrings ? (setOfStrings.map((str: string, index: number) => (
                <Checkbox key={index} value={str.toLowerCase()} label={str} color="black" />
              ))) : <></>}
            </Stack>
          </Checkbox.Group>
        }
      </Accordion.Panel>
    </Accordion.Item>

  </>;
}

function filterMuseums(
  museums: Museum[],
  filterTypes: string[],
  filterCities: string[],
  filterStates: string[],
  filterPrice: string[]
): Museum[] {
  const capitalizeWords = (s: string) =>
    s.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

  // Parse the min and max prices from the filterPrice array
  const minPrice = filterPrice[0] !== '' ? parseFloat(filterPrice[0]) : null;
  const maxPrice = filterPrice[1] !== '' ? parseFloat(filterPrice[1]) : null;

  return museums.filter(museum => {
    const uppercaseFilterTypes = filterTypes.map(type => type.toUpperCase());
    const capitalizedFilterCities = filterCities.map(capitalizeWords);
    const uppercaseFilterStates = filterStates.map(state => state.toUpperCase());

    const typeMatch = uppercaseFilterTypes.length === 0 || uppercaseFilterTypes.includes(museum.type.toUpperCase());
    const cityOrStateMatch = (capitalizedFilterCities.length === 0 && uppercaseFilterStates.length === 0) ||
      capitalizedFilterCities.includes(museum.city) ||
      uppercaseFilterStates.includes(museum.state.toUpperCase());

    // Check if the museum cost is within the min and max price range
    const priceMatch = (minPrice === null || museum.cost >= minPrice) &&
      (maxPrice === null || museum.cost <= maxPrice);

    return typeMatch && cityOrStateMatch && priceMatch;
  });
}
