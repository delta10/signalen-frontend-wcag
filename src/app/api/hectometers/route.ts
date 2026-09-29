import type { FeatureCollection } from 'geojson'
import { NextRequest, NextResponse } from 'next/server'
import { getServerConfig } from '@/services/config/config'
import {
  filterProvincialHectometerPosts,
  filterValidProvincialHectometerFeatures,
  findNearestProvincialHectometerPost,
} from '@/lib/utils/hectometer'

type SourceCacheEntry = {
  expiresAt: number
  request: Promise<FeatureCollection>
}

const SOURCE_CACHE_TTL_SECONDS = 5 * 60
const SOURCE_CACHE_TTL_MS = SOURCE_CACHE_TTL_SECONDS * 1000
const SOURCE_CACHE_CONTROL = `public, max-age=${SOURCE_CACHE_TTL_SECONDS}, s-maxage=${SOURCE_CACHE_TTL_SECONDS}, stale-while-revalidate=60`
const sourceCache = new Map<string, SourceCacheEntry>()

export const dynamic = 'force-dynamic'

const getSource = (sourceUrl: string) => {
  const cachedSource = sourceCache.get(sourceUrl)

  if (cachedSource && cachedSource.expiresAt > Date.now()) {
    return cachedSource.request
  }

  const request = fetch(sourceUrl, { cache: 'no-store' })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Could not fetch provincial hectometer layer.')
      }

      return response.json() as Promise<FeatureCollection>
    })
    .catch((error) => {
      if (sourceCache.get(sourceUrl)?.request === request) {
        sourceCache.delete(sourceUrl)
      }
      throw error
    })

  sourceCache.set(sourceUrl, {
    expiresAt: Date.now() + SOURCE_CACHE_TTL_MS,
    request,
  })

  return request
}

export const GET = async (request: NextRequest) => {
  const config = await getServerConfig()
  const searchQuery = request.nextUrl.searchParams.get('q')?.trim() ?? ''
  const configuredLayerId = config.base.pdok_hectometer_suggest?.sourceLayerId
  const requestedLayerId = request.nextUrl.searchParams.get('sourceLayerId')
  const latitudeParam = request.nextUrl.searchParams.get('lat')
  const longitudeParam = request.nextUrl.searchParams.get('lng')
  const distanceParam = request.nextUrl.searchParams.get('distance')
  const isSourceRequest =
    request.nextUrl.searchParams.get('validatedSource') === 'true'
  const latitude = latitudeParam === null ? NaN : Number(latitudeParam)
  const longitude = longitudeParam === null ? NaN : Number(longitudeParam)
  const distance = distanceParam === null ? NaN : Number(distanceParam)
  const isNearestRequest =
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    Number.isFinite(distance) &&
    distance >= 0

  if (
    (!searchQuery && !isNearestRequest && !isSourceRequest) ||
    !requestedLayerId ||
    !configuredLayerId ||
    requestedLayerId !== configuredLayerId
  ) {
    return NextResponse.json(
      { error: 'Invalid hectometer search request.' },
      { status: 400 }
    )
  }

  const sourceData = config.base.map.layers?.find(
    (layer) => layer.id === requestedLayerId && layer.source.type === 'geojson'
  )?.source.data

  if (typeof sourceData !== 'string') {
    return NextResponse.json(
      { error: 'Configured hectometer layer was not found.' },
      { status: 404 }
    )
  }

  const requestedLimitParam = request.nextUrl.searchParams.get('maxResults')
  const requestedLimit =
    requestedLimitParam === null ? NaN : Number(requestedLimitParam)
  const configuredLimit = config.base.pdok_hectometer_suggest?.maxResults
  const effectiveRequestedLimit = Number.isFinite(requestedLimit)
    ? requestedLimit
    : (configuredLimit ?? 10)
  const maxResults = Math.min(
    100,
    configuredLimit ?? 100,
    Math.max(1, effectiveRequestedLimit)
  )

  try {
    const source = await getSource(sourceData)

    if (isSourceRequest) {
      return NextResponse.json(
        filterValidProvincialHectometerFeatures(source),
        {
          headers: {
            'Cache-Control': SOURCE_CACHE_CONTROL,
          },
        }
      )
    }

    if (isNearestRequest) {
      return NextResponse.json(
        findNearestProvincialHectometerPost(
          source,
          latitude,
          longitude,
          distance
        )
      )
    }

    return NextResponse.json(
      filterProvincialHectometerPosts(source, searchQuery, maxResults)
    )
  } catch {
    return NextResponse.json(
      { error: 'Could not fetch provincial hectometer posts.' },
      { status: 502 }
    )
  }
}
