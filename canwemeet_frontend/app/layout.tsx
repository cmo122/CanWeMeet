import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import clockIcon from './components/icons/clock.svg'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CanWeMeet',
  description: 'Easy and intuitive tool for scheduling free time!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
