import { BuildingLibraryIcon, BuildingOffice2Icon, BuildingOfficeIcon, HomeIcon, HomeModernIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { MapPinIcon } from "@heroicons/react/24/outline";
import { useMuseums } from "../contexts/MuseumContext";

export default function Page() {
    return <div className="invisible w-1 h-1 p-0 m-[-1] absolute overflow-hidden border-0 ">
        {/* The button to open modal */}
        <label htmlFor="my_modal_7" className="btn">open modal</label>

        {/* Put this part before </body> tag */}
        <input type="checkbox" id="my_modal_7" checked={true} className="modal-toggle" />
        <div className="modal">
            <div className="modal-box p-0">
                <div className="w-full">
                    <div className="flex relative bg-white p-4 rounded-full items-center">
                        <MagnifyingGlassIcon className="w-4 h-4 absolute left-4 ml-2" />
                        <input
                            type="text"
                            placeholder="Search Cities..."
                            className="flex-grow rounded-none pl-8 py-2 outline-none border"
                        />
                    </div>

                    <div className="flex bg-white p-4">
                        <MapPinIcon className="w-6 h-6" />
                        <p>Detect my location</p>
                    </div>
                    <LoadCities />
                </div>
            </div>
            <label className="modal-backdrop" htmlFor="my_modal_7">Close</label>
        </div>
    </div>
}

function LoadCities() {

    const { cities } = useMuseums();

    const cityIconArr = [
        <BuildingLibraryIcon />,
        <BuildingOffice2Icon />,
        <BuildingOfficeIcon />,
        <HomeModernIcon />,
        <HomeIcon />
    ];

    return <>
        <div className="flex flex-col">
            {cities.map((city, index) => (
                <div key={index} className="flex bg-white p-4">
                    {cityIconArr[index % cityIconArr.length]}
                    <p>{city}</p>
                </div>
            ))}
        </div>

    </>
}