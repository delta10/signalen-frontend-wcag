import { Layout } from '@/types/layout'

export default function IncidentLayout({ children }: Layout) {
  return <main className="p-8">{children}</main>
}
