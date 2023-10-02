import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Header from './Header'
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
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
