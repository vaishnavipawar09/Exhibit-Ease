'use client';

import { Favorite, Museum } from '@prisma/client';
import React, { FC, useEffect, useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Accordion, ActionIcon, Center, Checkbox, Grid, Group, Input, NumberInput, SimpleGrid, Stack, Text } from '@mantine/core';
import { useRouter } from 'next/router';
import { useQueryState } from 'next-usequerystate'
import { ClearAll } from 'tabler-icons-react';
import { MuseumCard } from '@/app/components/MuseumSection';
import { useSession } from 'next-auth/react';
import { useMuseums } from '@/app/contexts/MuseumContext';

export default function Page() {
    const [favorited, setFavorited] = useState<Favorite[]>([])

    const [favMuseums, setFavMuseums] = useState<Museum[]>([])
    const { data: session } = useSession();
    const { getMuseumsByField } = useMuseums();

    useEffect(() => {
        const fetchMuseums = async () => {
            try {
                if (session?.user?.id) {
                    const res = await fetch(`/api/favorites?userId=${session?.user?.id}`)
                    const data = await res.json()
                    if (data.length > 0) {
                        const museums = data.flatMap((fav: Favorite) => getMuseumsByField('id', fav.museumId));
                        setFavMuseums(museums);
                        setFavorited(data);
                    }
                }
            } catch (error) {

            }
        }
        fetchMuseums()
    }, [session?.user?.id, getMuseumsByField])

    return <>

        {favMuseums.length > 0 ? <SimpleGrid cols={3}>
            {favMuseums.map((museum, index) => (
                <div key={museum.id}>
                    <MuseumCard index={index} museum={museum} />
                </div>
            ))}
        </SimpleGrid> : <Text>You have no museums favorited.</Text>}
    </>
}