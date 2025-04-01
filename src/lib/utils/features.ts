import { Feature } from 'geojson'
import crypto from 'crypto'

export function generateFeatureId(feature: Feature | undefined): string {
  if (!feature || !feature.geometry || !feature.properties) {
    return ''
  }

  // @ts-ignore
  const coordinates = feature.geometry?.coordinates.join(',')
  const createdAt = feature.properties.created_at

  // Combine values into a single string
  const idString = `${coordinates}|${createdAt}`

  // Create a hash of the combined string
  // Using SHA-256 for a good balance of uniqueness and length
  const hash = crypto.createHash('sha256').update(idString).digest('hex')

  // Return a shorter version of the hash if desired (first 10 characters)
  return hash.substring(0, 10)
}
