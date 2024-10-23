import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import '@utrecht/design-tokens/dist/index.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Maak een melding',
  description: 'Maak een melding bij jouw gemeente.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
