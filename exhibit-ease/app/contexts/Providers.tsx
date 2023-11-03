'use client';

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import { MuseumProvider } from './MuseumContext';

const Providers = ({
    children,
}: {
    children: React.ReactNode
}) => {
    return (
        <>
            <MuseumProvider>
                <ProgressBar
                    height="4px"
                    color="#d60b11"
                    options={{ showSpinner: false }}
                    shallowRouting
                />
                {children}
            </MuseumProvider>
        </>
    );
};

export default Providers;
