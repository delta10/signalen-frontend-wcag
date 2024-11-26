import { Feature } from 'geojson'

export interface FeatureWithDescription extends Feature {
  description: string
  id: number
}
