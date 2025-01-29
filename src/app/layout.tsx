import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import './nl-design-system-overrides.css'
// import './purmerend.css'
import '@utrecht/design-tokens/dist/index.css'
import '@nl-design-system-community/purmerend-design-tokens/dist/index.css'
import '@nl-design-system-community/purmerend-design-tokens/src/font.js'

const inter = Inter({ subsets: ['latin'] })

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
