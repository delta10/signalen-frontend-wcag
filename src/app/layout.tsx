import type { Metadata } from 'next'
import './globals.css'
import './nl-design-system-overrides.css'

export const metadata: Metadata = {
  description: 'Maak een melding bij jouw gemeente.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
