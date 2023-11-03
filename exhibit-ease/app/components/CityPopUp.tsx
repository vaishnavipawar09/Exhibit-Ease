/* eslint-disable react/jsx-key */
import { BuildingLibraryIcon, BuildingOffice2Icon, BuildingOfficeIcon, HomeIcon, HomeModernIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { MapPinIcon } from "@heroicons/react/24/outline";
import { useMuseums } from "../contexts/MuseumContext";
import React, { useState, useEffect, FC } from "react";
import { Button, Input, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

interface LoadCitiesProps {
    onCityClick: () => void;
}

export default function Page() {
    const [modalOpen, setModalOpen] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);
    const [opened, { open, close }] = useDisclosure(true);
    const handleModalClose = () => {
        setModalOpen(false);
        document.body.style.overflowY = 'auto';
    };

    const handleCitySelection = () => {
        localStorage.setItem('citySelected', 'true');
        handleModalClose();
    };

    // const handleDetectLocation = () => {
    //     handleModalClose();
    // };

    // const handleSearchAndSelectCity = () => {
    //     handleModalClose();
    // };

    // useEffect(() => {
    //     const citySelected = localStorage.getItem('citySelected');
    //     setModalOpen(!citySelected);
    //     setIsInitialized(true);

    //     if (modalOpen) {
    //         document.body.style.overflowY = 'hidden';
    //     } else {
    //         document.body.style.overflowY = 'auto';
    //     }
    // }, [modalOpen]);

    return (
        <>
            <Modal withCloseButton={false} closeOnClickOutside={false} closeOnEscape={false} opened={opened} onClose={close} centered>
                <div className=" py-4">
                    <Input size="md" placeholder="Search cities..." leftSection={<MagnifyingGlassIcon className="h-6" color='black' />}
                        styles={{
                            input: { borderColor: 'black', backgroundColor: 'white' }
                        }}
                        radius={8}
                    />
                </div>

                <Button color="rgba(166, 0, 0, 1)" leftSection={<MapPinIcon className="h-4 w-4" />} variant="transparent">Detect my location</Button>
                <LoadCities onCityClick={handleCitySelection} />
            </Modal>

            {/* <Button onClick={open}>Open centered Modal</Button>n  */}
        </>
    )

    // return <div className="invisible w-1 h-1 p-0 m-[-1] absolute overflow-hidden border-0 ">
    //     <label htmlFor="my_modal_7" className="btn">open modal</label>
    //     <input type="checkbox" id="my_modal_7" defaultChecked={true} className="modal-toggle" />
    //     {
    //         isInitialized && modalOpen && (
    //             <div className="modal" onClick={(e) => e.stopPropagation()}>


    //                 <div className="modal-box max-w-4xl p-0" onClick={(e) => e.stopPropagation()}>

    //                     <div className="w-full">
    //                         <div className="flex relative bg-white p-4 rounded-full items-center">
    //                             <MagnifyingGlassIcon className="w-4 h-4 absolute left-4 ml-2" />
    //                             <input
    //                                 type="text"
    //                                 placeholder="Search Cities..."
    //                                 className="flex-grow rounded-none pl-8 py-2 outline-none border"
    //                             />
    //                         </div>

    //                         <div className="flex bg-white p-4">
    //                             <MapPinIcon className="w-6 h-6" />
    //                             <p>Detect my location</p>
    //                         </div>
    //                         <LoadCities onCityClick={handleCitySelection} />
    //                     </div>
    //                 </div>
    //             </div>
    //         )
    //     }

    // </div>
}


const LoadCities: FC<LoadCitiesProps> = ({ onCityClick }) => {
    const { cities } = useMuseums();
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
        <div className="p-4 bg-white">
            <p className="mb-4 text-center">Popular Cities</p>
            <div className="grid grid-cols-1 justify-center gap-4 mb-10 md:grid-cols-4">
                {cities.slice(0, 4).map((city, index) => (
                    <div key={index} className="flex flex-col items-center" onClick={onCityClick}>
                        {React.cloneElement(cityIconArr[index % cityIconArr.length])}
                        <p className="mt-2">{city}</p>
                    </div>
                ))}
            </div>
            {showAll ? (
                <>
                    <p className="mb-4 text-center">Other Cities</p>
                    <div className="grid gap-0 mb-4 md:grid-cols-2 text-left">
                        {cities.slice(4).map((city, index) => (
                            <div key={index} className="flex flex-col">
                                <p>{city}</p>
                            </div>
                        ))}
                    </div>
                </>
            ) : null}
            <div className="text-center">
                <button
                    className="text-blue-500 hover:underline"
                    onClick={() => setShowAll(!showAll)}
                >
                    {showAll ? 'Hide All Cities' : 'View All Cities'}
                </button>
            </div>
        </div>
    );

}