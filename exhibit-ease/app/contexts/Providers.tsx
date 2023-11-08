'use client';

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import { MuseumProvider } from './MuseumContext';

import { usePathname } from 'next/navigation'
import CityPopUp from '../components/CityPopUp';

const Providers = ({
    children,
}: {
    children: React.ReactNode
}) => {
    const pathname = usePathname();
    const shouldShowPopup = (path: string) => {
        if (path === '/' || path === '/search') {
            return true;
        }

        const museumRegex = /^\/museums\/.+$/;
        if (museumRegex.test(path)) {
            return true;
        }

        return false;
    };

    return (
        <>
            <MuseumProvider>
                <ProgressBar
                    height="4px"
                    color="#d60b11"
                    options={{ showSpinner: false }}
                    shallowRouting
                />

                {shouldShowPopup(pathname) && <CityPopUp />}
                {children}
            </MuseumProvider>
        </>
    );
};

export default Providers;
