import { Feature } from 'geojson'

export interface FeatureWithDescription extends Feature {
  description: string
  id: number
}

export type AddressComboboxValue = {
  weergavenaam: string
  id: string
  coordinates: number[]
} | null
