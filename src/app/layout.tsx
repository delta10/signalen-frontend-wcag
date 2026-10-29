import type { Metadata } from 'next'
import '@nl-design-system-candidate/button-css/button.css'
import '@utrecht/design-tokens/dist/font-family.js'
import './app.css'
import config from '../../config.json'

export const metadata: Metadata = {
  description: config.base.naam
    ? `Maak een melding bij ${config.base.naam}.`
    : 'Maak een melding.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
