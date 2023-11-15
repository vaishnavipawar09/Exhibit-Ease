'use client';

import { Museum } from '@prisma/client';
import React, { FC, useEffect, useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Accordion, ActionIcon, Center, Checkbox, Grid, Group, Input, NumberInput, SimpleGrid, Stack } from '@mantine/core';
import { useRouter } from 'next/router';
import { useQueryState } from 'next-usequerystate'
import { ClearAll } from 'tabler-icons-react';
import { MuseumCard } from '@/app/components/MuseumSection';

export default function Page() {
    const [favoritedMuseums, setFavoritedMuseums] = useState<Museum[]>([])
    return <>

        <div className="flex-grow h-full card rounded-box place-items-center lg:w-4/5">
            <SimpleGrid cols={3}>
                {favoritedMuseums.map((museum, index) => (
                    <div key={museum.id}>
                        <MuseumCard index={index} museum={museum} />
                    </div>
                ))}
            </SimpleGrid>
        </div>
    </>
}