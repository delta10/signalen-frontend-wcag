import type { FeatureCollection } from 'geojson'
import type { Address } from '@/types/form'
import type { AppConfig } from '@/types/config'
import { isCoordinateOutsideRestrictedArea } from '@/lib/utils/restrictedAreaUtils'
import { NextRequest, NextResponse } from 'next/server'
import { getServerConfig } from '@/services/config/config'
import {
  filterProvincialHectometerPosts,
  getProvincialHectometers,
  findNearestProvincialHectometerPost,
} from '@/lib/utils/hectometer'

type HectometerSource = {
  geojson: FeatureCollection
  posts: Address[]
}

type SourceCacheEntry = {
  expiresAt: number
  request: Promise<HectometerSource>
}

const BOUNDARY_CHECK_BATCH_SIZE = 100
const SOURCE_CACHE_TTL_SECONDS = 5 * 60
const SOURCE_CACHE_TTL_MS = SOURCE_CACHE_TTL_SECONDS * 1000
const SOURCE_CACHE_CONTROL = `public, max-age=${SOURCE_CACHE_TTL_SECONDS}, s-maxage=${SOURCE_CACHE_TTL_SECONDS}, stale-while-revalidate=60`
const sourceCache = new Map<string, SourceCacheEntry>()

export const dynamic = 'force-dynamic'

// The prepared source depends on both the posts and the configured boundary.
const getAllowedHectometerSource = (sourceUrl: string, config: AppConfig) => {
  const cacheKey = JSON.stringify([
    sourceUrl,
    config.restrictSelectionArea,
    config.maptilerOutOfBoundsSelectionArea,
    config.maptilerOutOfBoundsLayerId,
  ])
  const cachedSource = sourceCache.get(cacheKey)

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
    .then(async (source) => {
      const validPosts = getProvincialHectometers(source)
      const allowedPosts: typeof validPosts = []

      // Bound concurrent tile requests when preparing the whole provincial layer.
      for (
        let offset = 0;
        offset < validPosts.length;
        offset += BOUNDARY_CHECK_BATCH_SIZE
      ) {
        const batch = validPosts.slice(
          offset,
          offset + BOUNDARY_CHECK_BATCH_SIZE
        )
        const outside = await Promise.all(
          batch.map(({ address }) => {
            const [lng, lat] = address.coordinates
            return isCoordinateOutsideRestrictedArea(config, lng, lat)
          })
        )
        allowedPosts.push(...batch.filter((_, index) => !outside[index]))
      }

      return {
        geojson: {
          ...source,
          features: allowedPosts.map(({ feature }) => feature),
        },
        posts: allowedPosts.map(({ address }) => address),
      }
    })
    .catch((error) => {
      if (sourceCache.get(cacheKey)?.request === request) {
        sourceCache.delete(cacheKey)
      }
      throw error
    })

  sourceCache.set(cacheKey, {
    expiresAt: Date.now() + SOURCE_CACHE_TTL_MS,
    request,
  })

  return request
}

const getNumericParam = (params: URLSearchParams, name: string) => {
  const value = params.get(name)
  return value === null ? NaN : Number(value)
}

export const GET = async (request: NextRequest) => {
  const config = await getServerConfig()
  const params = request.nextUrl.searchParams
  const searchQuery = params.get('q')?.trim() ?? ''
  const configuredLayerId = config.base.pdok_hectometer_suggest?.sourceLayerId
  const requestedLayerId = params.get('sourceLayerId')
  const isSourceRequest = params.get('validatedSource') === 'true'
  const isWarmupRequest = params.get('warmup') === 'true'
  const latitude = getNumericParam(params, 'lat')
  const longitude = getNumericParam(params, 'lng')
  const distance = getNumericParam(params, 'distance')
  const isNearestRequest =
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    Number.isFinite(distance) &&
    distance >= 0

  if (
    (!searchQuery &&
      !isNearestRequest &&
      !isSourceRequest &&
      !isWarmupRequest) ||
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

  try {
    const source = await getAllowedHectometerSource(sourceData, config)

    if (isWarmupRequest) {
      // Prepare the shared server cache without transferring the whole map layer.
      return new NextResponse(null, {
        status: 204,
        headers: { 'Cache-Control': 'no-store' },
      })
    }

    if (isSourceRequest) {
      return NextResponse.json(source.geojson, {
        headers: {
          'Cache-Control': SOURCE_CACHE_CONTROL,
        },
      })
    }

    if (isNearestRequest) {
      return NextResponse.json(
        findNearestProvincialHectometerPost(
          source.posts,
          latitude,
          longitude,
          distance
        )
      )
    }

    const requestedLimit = getNumericParam(params, 'maxResults')
    const configuredLimit = config.base.pdok_hectometer_suggest?.maxResults
    const effectiveRequestedLimit = Number.isFinite(requestedLimit)
      ? requestedLimit
      : (configuredLimit ?? 10)
    const maxResults = Math.min(
      100,
      configuredLimit ?? 100,
      Math.max(1, effectiveRequestedLimit)
    )

    return NextResponse.json(
      filterProvincialHectometerPosts(source.posts, searchQuery, maxResults)
    )
  } catch {
    return NextResponse.json(
      { error: 'Could not fetch provincial hectometer posts.' },
      { status: 502 }
    )
  }
}
