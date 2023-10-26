import Image from "next/image";
import React, { useEffect, useState } from 'react';
import { Museum, MuseumType } from '@prisma/client'
import Link from 'next/link';
import getMuseums from './Museums';
import { useMuseums } from "../contexts/MuseumContext";

interface MuseumSectionProps {
    title: string
    type: string
}

export const MuseumSection = ({ query }: { query: MuseumSectionProps }) => {
    const { getMuseumsByField } = useMuseums();

    var museums = getMuseumsByField('type', query.type as MuseumType).slice(0, 3);

    return (
        <div className=' mb-5 rounded-sm'>
            <p className='pt-5 pl-2 text-3xl font-semibold'>{query.title}</p>
            <div className='divider divider-vertical my-[8px] pl-2 pr-2 before:bg-gray-500 after:bg-gray-500'></div>
            <div className="flex w-full h-5/6 p-2">
                {museums.map((museum, index) => (
                    <MuseumCard key={index} index={index} museum={museum} />
                ))}
            </div>
        </div>
    );
};

export function MuseumCard({ museum, index }: { museum: Museum, index: number }) {
    return (
        <div className="flex w-full p-2 max-w-full min-h-[15rem]">
            <div className="card rounded-sm w-full relative bg-base-100 shadow-lg overflow-hidden h-full flex flex-col">
                <div className="relative flex-grow" style={{ backgroundImage: `url(${museum.main_image || ''})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                    <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-30"></div>
                </div>

                {/* Card Content */}
                <div className="absolute top-0 left-0 w-full h-full p-4 flex flex-col justify-between">
                    <div>
                        <h2 className="card-title line-clamp mb-[1rem] text-white">{museum.name}</h2>
                        <Link
                            href={"https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(museum?.address || '') + '+' + encodeURIComponent(museum?.city || '') + '+' + encodeURIComponent(museum?.state || '')}
                            rel="noopener noreferrer"
                            target="_blank"
                            className='mb-[.5rem] block text-white'>
                            {museum?.city}, {museum?.state}
                        </Link>
                    </div>
                    <div className="card-actions justify-evenly mt-auto">
                        <Link href={"/museums/" + museum.id} className="w-full">
                            <button className="btn btn-primary w-full bg-[#661900] mt-2">View Museum</button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
