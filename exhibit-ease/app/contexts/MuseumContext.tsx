'use client'

import { Museum } from '@prisma/client';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

interface MuseumContextProps {
    museums: Museum[];
    cities: Set<string>;
    states: Set<string>;
    fetchMuseums: () => void; // if you want to trigger data fetch from a component
    getMuseumsByField: <T extends keyof Museum>(field: T, value: Museum[T]) => Museum[];
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
    const [cities, setCities] = useState<Set<string>>(new Set());
    const [states, setStates] = useState<Set<string>>(new Set());

    const sortedMuseums = useMemo(() => {
        let clonedMuseums = [...museums];
        return clonedMuseums.sort((a, b) => a.id - b.id);
    }, [museums]);

    async function fetchMuseums() {
        try {
            const res = await fetch('/api/museums');
            const data = await res.json();
            setMuseums(data);
            setCities(new Set(data.map((museum: Museum) => museum.city)));
            setStates(new Set(data.map((museum: Museum) => museum.state)));
        } catch (error) {
            console.error("Error fetching museums:", error);
        }
    }

    const getMuseumsByField = <T extends keyof Museum>(field: T, value: Museum[T]): Museum[] => {
        return sortedMuseums.filter(museum => museum[field] === value);
    }


    useEffect(() => {
        fetchMuseums(); // call it here
    }, []);
    return (
        <MuseumContext.Provider value={{ museums: sortedMuseums, cities, states, fetchMuseums, getMuseumsByField }}>
            {children}
        </MuseumContext.Provider>
    );
};
