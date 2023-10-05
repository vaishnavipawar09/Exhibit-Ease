import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Header from './components/Header'
import { getServerSession } from 'next-auth';
import SessionProvider from './components/SessionProvider';

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
      <body className={inter.className}>
        <SessionProvider session={session}>
          <Header />
          <div className="flex">
            <div className="w-40 bg-red">
              01
            </div>
            <div className="flex-grow">
              {children}
            </div>
            <div className="w-40 bg-red">
              03
            </div>
          </div>




        </SessionProvider>
      </body>
    </html>
  )
}
