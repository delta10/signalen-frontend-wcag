import type { Metadata } from 'next'
import './globals.css'
import './nl-design-system-overrides.css'

// todo how to do font
import '@nl-design-system-community/purmerend-design-tokens/src/font.js'

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
