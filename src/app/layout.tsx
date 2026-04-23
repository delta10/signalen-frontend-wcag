import type { Metadata } from 'next'
import '@nl-design-system-candidate/button-css/button.css'
import './app.css'

export const metadata: Metadata = {
  description: 'Maak een melding bij de provincie.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
