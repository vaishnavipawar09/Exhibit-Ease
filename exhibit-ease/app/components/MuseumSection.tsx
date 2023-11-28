'use client';

import React, { useEffect, useState } from 'react';
import { Museum, MuseumType } from '@prisma/client'
import Link from 'next/link';
import { useMuseums } from "../contexts/MuseumContext";
import { Button, Card, Text, Image, Loader } from "@mantine/core";
import MuseumCard from './MuseumCard';

interface MuseumSectionProps {
    title: string
    type?: string
    city?: string
}

export const MuseumSection = ({ query }: { query: MuseumSectionProps }) => {
    const { getMuseumsByField } = useMuseums();
    let museums;
    if (query.type) {
        museums = getMuseumsByField('type', query.type as MuseumType).slice(0, 3);
    } else {
        museums = getMuseumsByField('city', query.city || '').slice(0, 3);
    }

    return <main>
        <div className='mb-5 rounded-sm'>
            <p className='pt-5 pb-2 text-3xl font-semibold'>{query.title}</p>
            <div className="grid grid-cols-3 gap-4 w-full">
                {museums && museums.length > 0 ? museums.map(
                    (museum, index) => (
                        <MuseumCard key={index} index={index} museum={museum} />
                    )
                ) : <div className="flex justify-center items-center h-full w-full">
                    <Loader />
                </div>}
            </div>
        </div>
    </main>;
};
