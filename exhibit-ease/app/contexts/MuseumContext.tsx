'use client'

import { Museum } from '@prisma/client';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface MuseumContextProps {
    museums: Museum[];
    cities: Set<string>;
    states: Set<string>;
    fetchMuseums: () => void; // if you want to trigger data fetch from a component
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

    useEffect(() => {
        fetchMuseums(); // call it here
    }, []);
    return (
        <MuseumContext.Provider value={{ museums, cities, states, fetchMuseums }}>
            {children}
        </MuseumContext.Provider>
    );
};
