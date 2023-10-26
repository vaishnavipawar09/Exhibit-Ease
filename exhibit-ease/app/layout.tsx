import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Header from './components/Header'
import { getServerSession } from 'next-auth';
import SessionProvider from './components/SessionProvider';
import { MuseumProvider } from './contexts/MuseumContext';

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
    <html lang="en">
      <head>
        {/* Make sure to include any necessary meta tags, scripts, and styles here */}
      </head>
      <body className={inter.className}>
        <SessionProvider session={session}>
          <MuseumProvider>
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
          </MuseumProvider>
        </SessionProvider>
      </body>
    </html>
  );

}
