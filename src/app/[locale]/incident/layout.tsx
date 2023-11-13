import { Layout } from '@/types/layout'
import { Stepper } from '@/app/[locale]/incident/components/Stepper'

export default function IncidentLayout({ children }: Layout) {
  return (
    <main className="p-8">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-4">
        <div className="col-span-1">
          <Stepper />
        </div>
        <div className="col-span-1 md:col-span-3">{children}</div>
      </div>
    </main>
  )
}
