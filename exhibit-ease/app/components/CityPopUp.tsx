/* eslint-disable react/jsx-key */
import { BuildingLibraryIcon, BuildingOffice2Icon, BuildingOfficeIcon, HomeIcon, HomeModernIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useMuseums } from "../contexts/MuseumContext";
import React, { useState, useEffect, FC } from "react";
import { Autocomplete, Button, Input, Modal, Select, SimpleGrid, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

interface LoadCitiesProps {
    onCityClick: (city: string) => void;
    cities: string[];
}

export default function Page() {
    const [opened, { open, close }] = useDisclosure(false);
    const [dropdownOpened, setDropdownOpened] = useState(false);
    const [chosenCity, setChosenCity] = useState<string | null>(null);

    const { cities } = useMuseums();
    useEffect(() => {
        var citySelected = localStorage.getItem('citySelected');
        var choosenCity = localStorage.getItem('choosenCity');
        if ((citySelected && citySelected === 'true') && (choosenCity && choosenCity.length > 0)) {
            close();
            return;
        }
        open();
    }, []);

    useEffect(() => {
        const storedCity = localStorage.getItem('choosenCity');
        if (storedCity) {
            setChosenCity(storedCity);
        }
    }, []);

    const handleCitySelection = (city: string) => {
        localStorage.setItem('citySelected', 'true');
        localStorage.setItem('choosenCity', city);
        close();
        window.location.reload();
    };

    return (
        <>
            <Modal withCloseButton={false} closeOnClickOutside={false} closeOnEscape={false} opened={opened} onClose={close} centered size="65%">
                <div className=" py-4">
                    <Autocomplete
                        leftSection={<MagnifyingGlassIcon className="h-6" color='black' />}
                        size="md"
                        placeholder="Pick a city"
                        data={cities}
                        radius={8}
                        styles={{
                            input: { borderColor: 'black', backgroundColor: 'white' },
                            dropdown: { backgroundColor: 'white', borderColor: 'black' },
                            option: { fontSize: '.675rem' }
                        }}
                        maxDropdownHeight={75}
                        dropdownOpened={dropdownOpened}
                        onClick={() => setDropdownOpened(true)}
                        onDropdownClose={() => setDropdownOpened(false)}
                        onOptionSubmit={(e) => handleCitySelection(e)}
                    />
                </div>
                <LoadCities onCityClick={handleCitySelection} cities={cities} />
            </Modal>
        </>
    )
}


const LoadCities: FC<LoadCitiesProps> = ({ onCityClick, cities }) => {

    const [showAll, setShowAll] = useState(false);

    const iconCommonClasses = "w-8 h-8";

    const cityIconArr = [
        <BuildingLibraryIcon className={iconCommonClasses} />,
        <BuildingOffice2Icon className={iconCommonClasses} />,
        <BuildingOfficeIcon className={iconCommonClasses} />,
        <HomeModernIcon className={iconCommonClasses} />,
        <HomeIcon className={iconCommonClasses} />
    ];

    return (
        <div className="p-4">
            <Text ta='center' style={{ paddingBottom: '1rem' }}>Popular Cities</Text>
            <SimpleGrid cols={4} spacing="xs" verticalSpacing="xs" style={{ paddingBottom: '1rem' }}>
                {cities.slice(0, 4).map((city, index) => (
                    <div key={index} className="flex flex-col items-center cursor-pointer" onClick={() => onCityClick(city)}>
                        {React.cloneElement(cityIconArr[index % cityIconArr.length])}
                        <p className="mt-2">{city}</p>
                    </div>
                ))}
            </SimpleGrid>
            {showAll ? (
                <>
                    <Text ta='center' style={{ paddingBottom: '1rem' }}>Other Cities</Text>
                    <SimpleGrid cols={3} spacing="xs" verticalSpacing="xs" style={{ paddingBottom: '1rem' }}>

                        {cities.slice(4).map((city, index) => (
                            <div key={index} onClick={() => onCityClick(city)} className="text-sm cursor-pointer text-gray-400 hover:text-black">
                                <p>{city}</p>
                            </div>
                        ))}

                    </SimpleGrid>
                </>
            ) : null}
            <div className="text-center">
                <Button
                    className="text-blue-500 hover:underline"
                    onClick={() => setShowAll(!showAll)}
                    variant="transparent"
                    color="#a60000"
                >
                    {showAll ? 'Hide All Cities' : 'View All Cities'}
                </Button>
            </div>
        </div>
    );

}