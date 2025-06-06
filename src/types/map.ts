import { Feature } from 'geojson'

export interface ExtendedFeature extends Feature {
  description: string
  label: string
  id: number
  internal_id: number
}
