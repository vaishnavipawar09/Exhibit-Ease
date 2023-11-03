import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Header from './components/Header'
import { getServerSession } from 'next-auth';
import SessionProvider from './components/SessionProvider';
import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import Providers from './contexts/Providers';

import '@mantine/carousel/styles.css';
import '@mantine/core/styles.css';



const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Exhibit Ease',
  description: 'One stop shop for buying musuem tickets!',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const session = await getServerSession();

  return (
    <html lang="en" className='bg-[#f7f4f3]'>
      <head>
        <ColorSchemeScript />
      </head>
      <body className={inter.className}>
        <MantineProvider theme={{ white: '#f7f4f3' }}>
          <SessionProvider session={session}>
            <Providers>
              <Header />
              <div className="grid grid-cols-10 gap-0">
                <div className="col-span-1 bg-red">
                  {/* Left content here */}
                </div>
                <div className="col-span-8">
                  {children}
                </div>
                <div className="col-span-1 bg-red">
                  {/* Right content here */}
                </div>
              </div>
            </Providers>
          </SessionProvider>
        </MantineProvider>
      </body>
    </html>
  );

}
