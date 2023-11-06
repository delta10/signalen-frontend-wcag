import { notFound } from 'next/navigation'

export default function CatchAllPage() {
  notFound()

  return <div>NotFound</div>
}
