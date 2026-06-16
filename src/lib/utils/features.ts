import { Feature } from 'geojson'
import crypto from 'crypto'

export function generateFeatureId(feature: Feature | undefined): string {
  if (!feature || !feature.geometry || !feature.properties) {
    return ''
  }

  console.log(feature)

  // @ts-ignore
  const coordinates = feature.geometry?.coordinates.join(',')
  const createdAt = feature.properties.created_at

  // Create a base64 encoded unique string
  return btoa(`${coordinates}|${createdAt}`)
}
