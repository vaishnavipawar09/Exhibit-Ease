import Image from "next/image";
import React, { useEffect, useState } from 'react';
import { Museum, MuseumType } from '@prisma/client'
import Link from 'next/link';
import getMuseums from './Museums';
import { useMuseums } from "../contexts/MuseumContext";
import { Button, Card, Group, Overlay, Paper, Text, Title } from "@mantine/core";

interface MuseumSectionProps {
    title: string
    type: string
}

export const MuseumSection = ({ query }: { query: MuseumSectionProps }) => {
    const { getMuseumsByField } = useMuseums();

    var museums = getMuseumsByField('type', query.type as MuseumType).slice(0, 3);

    return (
        <div className=' mb-5 rounded-sm'>
            <p className='pt-5 pb-2 text-3xl font-semibold'>{query.title}</p>
            <div className="grid grid-cols-3 gap-4 w-full">
                {museums && museums.map(
                    (museum, index) => (
                        <MuseumCard key={index} index={index} museum={museum} />
                    )
                )}
            </div>
        </div>
    );
};

export function MuseumCard({ museum, index }: { museum: Museum, index: number }) {
    const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(museum?.address || '')}+${encodeURIComponent(museum?.city || '')}+${encodeURIComponent(museum?.state || '')}`;
    return (
        <Card style={{ maxWidth: '100%', minHeight: '15rem', position: 'relative', overflow: 'hidden' }} radius="sm" shadow="lg">
            <Image
                src={museum.main_image || ''}
                alt={museum.name}
                layout="fill"
                objectFit='cover'
            />

            <div className="absolute top-0 right-0 bottom-0 left-0 bg-gray-800 bg-opacity-50"></div>

            <div className="z-10 text-white">
                <Text style={{ fontSize: '1.875rem', fontWeight: 'bold', lineHeight: '2rem' }} >
                    {museum.name}
                </Text>
                <Text component="a" href={googleMapsLink} target="_blank" rel="noopener noreferrer" className="mb-2">
                    {museum.city}, {museum.state}
                </Text>
            </div>

            <div className="absolute left-0 right-0 bottom-0 p-4">
                <Button component={Link} href={`/museums/${museum.id}`} style={{ width: '100%', backgroundColor: '#a60000' }}>
                    View Museum
                </Button>

            </div>
        </Card>

    );
}
