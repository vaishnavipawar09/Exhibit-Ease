'use client'

import { Museum } from '@prisma/client';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

interface MuseumContextProps {
    museums: Museum[];
    cities: string[];
    states: string[];
    fetchMuseums: () => void; // if you want to trigger data fetch from a component
    getMuseumsByField: <T extends keyof Museum>(field: T, value: Museum[T]) => Museum[];
    isLoading: boolean;
}

interface MuseumProviderProps {
    children: React.ReactNode;
}

const MuseumContext = createContext<MuseumContextProps | undefined>(undefined);

export const useMuseums = () => {
    const context = useContext(MuseumContext);
    if (!context) {
        throw new Error('useMuseums must be used within a MuseumProvider');
    }
    return context;
};

export const MuseumProvider: React.FC<MuseumProviderProps> = ({ children }) => {
    const [museums, setMuseums] = useState<Museum[]>([]);
    const [cities, setCities] = useState<string[]>([]);
    const [states, setStates] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const sortedMuseums = useMemo(() => {
        let clonedMuseums = [...museums];
        return clonedMuseums.sort((a, b) => a.id - b.id);
    }, [museums]);

    async function fetchMuseums() {
        try {
            setIsLoading(true); // Set isLoading to true when fetching starts
            const res = await fetch('/api/museums');
            const data = await res.json();
            setMuseums(data);
            setCities(Array.from(new Set(data.map((museum: Museum) => museum.city))));
            setStates(Array.from(new Set(data.map((museum: Museum) => museum.state))));
            setIsLoading(false); // Set isLoading to false when fetching ends
        } catch (error) {
            console.error("Error fetching museums:", error);
            setIsLoading(false); // Set isLoading to false even if there's an error
        }
    }

    const getMuseumsByField = <T extends keyof Museum>(field: T, value: Museum[T]): Museum[] => {
        return sortedMuseums.filter(museum => museum[field] === value);
    }


    useEffect(() => {
        fetchMuseums(); // call it here
    }, []);
    return (
        <MuseumContext.Provider value={{ museums: sortedMuseums, cities, states, fetchMuseums, getMuseumsByField, isLoading }}>
            {children}
        </MuseumContext.Provider>
    );
};
